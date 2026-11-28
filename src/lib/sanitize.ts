// Allowlist HTML sanitiser for chapter bodies, using the Workers HTMLRewriter.
const ALLOWED = new Set(['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'h2', 'h3', 'blockquote', 'ul', 'ol', 'li', 'hr', 'a']);
const DROP = new Set(['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button', 'svg', 'math', 'template', 'noscript', 'link', 'meta']);

export async function sanitizeHtml(html: string): Promise<string> {
  const rewriter = new HTMLRewriter().on('*', {
    element(el) {
      const tag = el.tagName.toLowerCase();
      if (DROP.has(tag)) return el.remove();
      if (!ALLOWED.has(tag)) return el.removeAndKeepContent();
      const href = tag === 'a' ? el.getAttribute('href') ?? '' : '';
      for (const [name] of [...el.attributes]) el.removeAttribute(name);
      if (tag === 'a' && /^(https?:|mailto:|\/)/i.test(href.trim())) {
        el.setAttribute('href', href.trim());
        if (/^https?:/i.test(href.trim())) {
          el.setAttribute('target', '_blank');
          el.setAttribute('rel', 'noopener nofollow');
        }
      }
    },
    comments(c) {
      c.remove();
    },
  });
  return rewriter.transform(new Response(html, { headers: { 'content-type': 'text/html' } })).text();
}
