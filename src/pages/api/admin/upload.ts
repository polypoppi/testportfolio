import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';

const TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};
// D1 rows are capped at 2 MB; the admin resizes images in the browser before upload.
const MAX = 1.8 * 1024 * 1024;

export const POST: APIRoute = async ({ request }) => {
  const fd = await request.formData();
  const file = fd.get('file');
  if (!(file instanceof File)) return new Response('No file received.', { status: 400 });
  const ext = TYPES[file.type];
  if (!ext) return new Response('Please upload a JPG, PNG, WebP, GIF or AVIF image.', { status: 415 });
  if (file.size > MAX) return new Response('That image is still too large after resizing. Try a smaller one.', { status: 413 });
  const key = `${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${ext}`;
  await db()
    .prepare('INSERT INTO media (key, type, data) VALUES (?1, ?2, ?3)')
    .bind(key, file.type, await file.arrayBuffer())
    .run();
  return Response.json({ url: `/media/${key}` });
};
