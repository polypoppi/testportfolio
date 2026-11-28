import type { APIRoute } from 'astro';
import { db, countWords } from '../../../../lib/db';
import { sanitizeHtml } from '../../../../lib/sanitize';

export const PUT: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  const b = (await request.json()) as { title?: string; body?: string; published?: boolean; publish_at?: string | null };
  const body = await sanitizeHtml(String(b.body ?? ''));
  const publishAt = b.publish_at && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(b.publish_at) ? b.publish_at : null;
  const words = countWords(body);
  const row = await db()
    .prepare(
      `UPDATE chapters SET title = ?1, body = ?2, published = ?3, publish_at = ?4, words = ?5, updated_at = datetime('now')
       WHERE id = ?6 RETURNING updated_at`,
    )
    .bind(String(b.title ?? '').trim() || 'Untitled chapter', body, b.published ? 1 : 0, publishAt, words, id)
    .first<{ updated_at: string }>();
  if (!row) return new Response('Not found', { status: 404 });
  return Response.json({ words, updated_at: row.updated_at });
};
