import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';

const TABLES = new Set(['chapters', 'stories', 'projects', 'experience']);

export const POST: APIRoute = async ({ request }) => {
  const { table, ids } = (await request.json()) as { table: string; ids: number[] };
  if (!TABLES.has(table) || !Array.isArray(ids) || !ids.every(Number.isInteger)) {
    return new Response('Bad request', { status: 400 });
  }
  await db().batch(ids.map((id, i) => db().prepare(`UPDATE ${table} SET position = ?1 WHERE id = ?2`).bind(i, id)));
  return Response.json({ ok: true });
};
