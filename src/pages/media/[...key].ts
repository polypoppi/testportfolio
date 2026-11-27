import type { APIRoute } from 'astro';
import { db } from '../../lib/db';

export const GET: APIRoute = async ({ params }) => {
  const row = await db()
    .prepare('SELECT type, data FROM media WHERE key = ?1')
    .bind(params.key ?? '')
    .first<{ type: string; data: ArrayBuffer | number[] }>();
  if (!row) return new Response('Not found', { status: 404 });
  const bytes = row.data instanceof ArrayBuffer ? row.data : new Uint8Array(row.data);
  return new Response(bytes, {
    headers: { 'Content-Type': row.type, 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
};
