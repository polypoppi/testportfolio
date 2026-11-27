import { env } from 'cloudflare:workers';
import type { AstroCookies } from 'astro';
import { db, getRawSetting, setSetting } from './db';

export const SESSION_COOKIE = 'mg_session';
const SESSION_DAYS = 14;
const ITERATIONS = 100_000; // Workers caps PBKDF2 at 100k iterations
const MAX_FAILS = 5;
const FAIL_WINDOW_MS = 15 * 60 * 1000;

const enc = new TextEncoder();
const toHex = (buf: ArrayBuffer | Uint8Array) =>
  [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const fromHex = (hex: string) => new Uint8Array(hex.match(/.{2}/g)!.map((h) => parseInt(h, 16)));

async function pbkdf2(password: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256);
}

/** Format: pbkdf2$<iterations>$<saltHex>$<hashHex> */
export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, ITERATIONS);
  return `pbkdf2$${ITERATIONS}$${toHex(salt)}$${toHex(hash)}`;
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function verifyPassword(password: string, stored: string) {
  if (stored.startsWith('plain$')) return timingSafeEqual(password, stored.slice(6));
  const [scheme, iter, saltHex, hashHex] = stored.split('$');
  if (scheme !== 'pbkdf2' || !iter || !saltHex || !hashHex) return false;
  const hash = await pbkdf2(password, fromHex(saltHex), Number(iter));
  return timingSafeEqual(toHex(hash), hashHex);
}

type Creds = { username: string; hash: string };

/** Credentials changed from the admin take priority over the deploy-time secret. */
async function currentCreds(): Promise<Creds | null> {
  const saved = await getRawSetting<Creds>('admin_auth');
  if (saved?.hash) return saved;
  const e = env as unknown as Record<string, string | undefined>;
  const username = e.ADMIN_USERNAME || 'admin';
  if (e.ADMIN_PASSWORD_HASH) return { username, hash: e.ADMIN_PASSWORD_HASH };
  // A plain ADMIN_PASSWORD secret (encrypted by Cloudflare) also works for the first sign-in.
  if (e.ADMIN_PASSWORD) return { username, hash: `plain$${e.ADMIN_PASSWORD}` };
  return null;
}

export async function currentUsername() {
  return (await currentCreds())?.username ?? 'admin';
}

export async function isRateLimited(ip: string) {
  const since = Date.now() - FAIL_WINDOW_MS;
  const row = await db()
    .prepare('SELECT COUNT(*) AS n FROM login_attempts WHERE ip = ?1 AND at > ?2')
    .bind(ip, since)
    .first<{ n: number }>();
  return (row?.n ?? 0) >= MAX_FAILS;
}

export async function checkLogin(ip: string, username: string, password: string) {
  const creds = await currentCreds();
  const ok =
    !!creds &&
    timingSafeEqual(username.trim().toLowerCase(), creds.username.toLowerCase()) &&
    (await verifyPassword(password, creds.hash));
  if (!ok) {
    await db().prepare('INSERT INTO login_attempts (ip, at) VALUES (?1, ?2)').bind(ip, Date.now()).run();
  } else {
    await db().prepare('DELETE FROM login_attempts WHERE ip = ?1 OR at < ?2').bind(ip, Date.now() - FAIL_WINDOW_MS).run();
  }
  return ok;
}

const sha256 = async (s: string) => toHex(await crypto.subtle.digest('SHA-256', enc.encode(s)));

export async function createSession(cookies: AstroCookies, secure: boolean) {
  const token = toHex(crypto.getRandomValues(new Uint8Array(32)));
  const expires = Date.now() + SESSION_DAYS * 86400_000;
  await db().prepare('DELETE FROM sessions WHERE expires_at < ?1').bind(Date.now()).run();
  await db().prepare('INSERT INTO sessions (id, expires_at) VALUES (?1, ?2)').bind(await sha256(token), expires).run();
  cookies.set(SESSION_COOKIE, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure,
    expires: new Date(expires),
  });
}

export async function validSession(token: string | undefined) {
  if (!token || !/^[0-9a-f]{64}$/.test(token)) return false;
  const row = await db()
    .prepare('SELECT expires_at FROM sessions WHERE id = ?1')
    .bind(await sha256(token))
    .first<{ expires_at: number }>();
  return !!row && row.expires_at > Date.now();
}

export async function destroySession(cookies: AstroCookies) {
  const token = cookies.get(SESSION_COOKIE)?.value;
  if (token) await db().prepare('DELETE FROM sessions WHERE id = ?1').bind(await sha256(token)).run();
  cookies.delete(SESSION_COOKIE, { path: '/' });
}

export async function changeCredentials(username: string, password: string) {
  await setSetting('admin_auth', { username: username.trim(), hash: await hashPassword(password) });
  await db().prepare('DELETE FROM sessions').run(); // sign out everywhere
}
