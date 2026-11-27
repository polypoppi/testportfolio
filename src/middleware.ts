import { defineMiddleware } from 'astro:middleware';
import { SESSION_COOKIE, validSession } from './lib/auth';

export const onRequest = defineMiddleware(async (ctx, next) => {
  const path = ctx.url.pathname;
  const isAdmin = path === '/admin' || path.startsWith('/admin/') || path.startsWith('/api/admin/');
  const isLogin = path === '/admin/login' || path === '/admin/login/';

  if (isAdmin && !isLogin) {
    const ok = await validSession(ctx.cookies.get(SESSION_COOKIE)?.value);
    if (!ok) {
      if (path.startsWith('/api/')) return new Response('Unauthorized', { status: 401 });
      return ctx.redirect(`/admin/login?next=${encodeURIComponent(path)}`);
    }
  }

  const res = await next();
  if (isAdmin) {
    res.headers.set('Cache-Control', 'no-store');
    res.headers.set('X-Robots-Tag', 'noindex');
  }
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  return res;
});
