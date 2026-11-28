// Generates migrations/0002_seed.sql from src/data/profile.ts (the resume content).
import { writeFileSync } from 'node:fs';
import * as d from '../src/data/profile.ts';

const q = (v: unknown) => `'${String(v).replace(/'/g, "''")}'`;
const j = (v: unknown) => q(JSON.stringify(v));
const out: string[] = [];

const settings: Record<string, unknown> = {
  profile: d.profile,
  tools: d.tools,
  highlights: d.highlights,
  skills: d.skillGroups,
  education: d.education,
  certifications: d.certifications,
};
for (const [k, v] of Object.entries(settings)) out.push(`INSERT INTO settings (key, value) VALUES (${q(k)}, ${j(v)});`);

d.experience.forEach((e, i) => out.push(`INSERT INTO experience (position, data) VALUES (${i}, ${j(e)});`));

d.projects.forEach((p, i) => {
  const { slug, ...rest } = p;
  out.push(`INSERT INTO projects (slug, position, published, data) VALUES (${q(slug)}, ${i}, 1, ${j({ ...rest, body: p.body.join('\n\n') })});`);
});

d.stories.forEach((s, i) => {
  out.push(
    `INSERT INTO stories (slug, title, blurb, tags, status, cover, position, published) VALUES (${q(s.slug)}, ${q(s.title)}, ${q(s.blurb)}, ${j(s.tags)}, ${q(s.status)}, '', ${i}, 0);`,
  );
  s.chapters.forEach((c, ci) => {
    const html = c.body.map((p) => `<p>${p}</p>`).join('');
    const words = c.body.join(' ').split(/\s+/).length;
    out.push(
      `INSERT INTO chapters (story_id, slug, title, body, position, published, words) VALUES ((SELECT id FROM stories WHERE slug = ${q(s.slug)}), ${q(c.slug)}, ${q(c.title)}, ${q(html)}, ${ci}, 1, ${words});`,
    );
  });
});

writeFileSync(new URL('../migrations/0002_seed.sql', import.meta.url), out.join('\n') + '\n');
console.log(`wrote ${out.length} statements`);
