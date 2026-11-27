import { env } from 'cloudflare:workers';

export const db = () => env.DB;

export type Profile = {
  name: string;
  fullName: string;
  firstName: string;
  initials: string;
  title: string;
  role: string;
  company: string;
  location: string;
  since: number;
  email: string;
  linkedin: string;
  github: string;
  photo: string;
  intro: string;
};
export type Tool = { code: string; name: string };
export type Highlight = { value: string; unit: string; label: string };
export type SkillGroup = { name: string; items: string[] };
export type Education = { title: string; school: string; years: string };

export type Job = {
  id?: number;
  role: string;
  company: string;
  place: string;
  start: string;
  end: string;
  tag: string;
  points: string[];
};

export type Project = {
  id?: number;
  slug: string;
  published?: boolean;
  title: string;
  org: string;
  year: string;
  summary: string;
  stack: string[];
  body: string; // paragraphs separated by blank lines
};

export type Story = {
  id: number;
  slug: string;
  title: string;
  blurb: string;
  tags: string[];
  status: string;
  cover: string;
  position: number;
  published: boolean;
  updated_at: string;
};

export type Chapter = {
  id: number;
  story_id: number;
  slug: string;
  title: string;
  body: string;
  position: number;
  published: boolean;
  publish_at: string | null;
  words: number;
  updated_at: string;
};

export type Settings = {
  profile: Profile;
  tools: Tool[];
  highlights: Highlight[];
  skills: SkillGroup[];
  education: Education[];
  certifications: string[];
};

export async function getSettings(): Promise<Settings> {
  const { results } = await db().prepare('SELECT key, value FROM settings').all<{ key: string; value: string }>();
  const map = Object.fromEntries(results.map((r) => [r.key, JSON.parse(r.value)]));
  return {
    profile: map.profile ?? {},
    tools: map.tools ?? [],
    highlights: map.highlights ?? [],
    skills: map.skills ?? [],
    education: map.education ?? [],
    certifications: map.certifications ?? [],
  };
}

export async function setSetting(key: keyof Settings | 'admin_auth', value: unknown) {
  await db()
    .prepare('INSERT INTO settings (key, value) VALUES (?1, ?2) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
    .bind(key, JSON.stringify(value))
    .run();
}

export async function getRawSetting<T>(key: string): Promise<T | null> {
  const row = await db().prepare('SELECT value FROM settings WHERE key = ?1').bind(key).first<{ value: string }>();
  return row ? (JSON.parse(row.value) as T) : null;
}

export async function getExperience(): Promise<Job[]> {
  const { results } = await db().prepare('SELECT id, data FROM experience ORDER BY position, id').all<{ id: number; data: string }>();
  return results.map((r) => ({ ...JSON.parse(r.data), id: r.id }));
}

const toProject = (r: { id: number; slug: string; published: number; data: string }): Project => ({
  ...JSON.parse(r.data),
  id: r.id,
  slug: r.slug,
  published: !!r.published,
});

export async function getProjects(includeHidden = false): Promise<Project[]> {
  const sql = `SELECT id, slug, published, data FROM projects ${includeHidden ? '' : 'WHERE published = 1'} ORDER BY position, id`;
  const { results } = await db().prepare(sql).all<any>();
  return results.map(toProject);
}

export async function getProject(slug: string): Promise<Project | null> {
  const r = await db().prepare('SELECT id, slug, published, data FROM projects WHERE slug = ?1').bind(slug).first<any>();
  return r ? toProject(r) : null;
}

const toStory = (r: any): Story => ({ ...r, tags: JSON.parse(r.tags || '[]'), published: !!r.published });
const toChapter = (r: any): Chapter => ({ ...r, published: !!r.published });

// A chapter is live when it is published and its scheduled time (if any) has passed.
const live = (a = '') =>
  `${a}published = 1 AND (${a}publish_at IS NULL OR ${a}publish_at <= strftime('%Y-%m-%dT%H:%M', 'now'))`;
const LIVE = live();

export async function getStories(includeHidden = false) {
  const sql = `SELECT s.*, (SELECT COUNT(*) FROM chapters c WHERE c.story_id = s.id ${includeHidden ? '' : `AND ${live('c.')}`}) AS chapter_count
    FROM stories s ${includeHidden ? '' : 'WHERE s.published = 1'} ORDER BY s.position, s.id`;
  const { results } = await db().prepare(sql).all<any>();
  return results.map((r) => ({ ...toStory(r), chapterCount: r.chapter_count as number }));
}

export async function getStoryBySlug(slug: string, includeHidden = false) {
  const r = await db()
    .prepare(`SELECT * FROM stories WHERE slug = ?1 ${includeHidden ? '' : 'AND published = 1'}`)
    .bind(slug)
    .first<any>();
  return r ? toStory(r) : null;
}

export async function getStoryById(id: number) {
  const r = await db().prepare('SELECT * FROM stories WHERE id = ?1').bind(id).first<any>();
  return r ? toStory(r) : null;
}

export async function getChapters(storyId: number, includeHidden = false): Promise<Chapter[]> {
  const { results } = await db()
    .prepare(`SELECT * FROM chapters WHERE story_id = ?1 ${includeHidden ? '' : `AND ${LIVE}`} ORDER BY position, id`)
    .bind(storyId)
    .all<any>();
  return results.map(toChapter);
}

export async function getChapter(id: number): Promise<Chapter | null> {
  const r = await db().prepare('SELECT * FROM chapters WHERE id = ?1').bind(id).first<any>();
  return r ? toChapter(r) : null;
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'untitled';

export const countWords = (html: string) => {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').trim();
  return text ? text.split(/\s+/).length : 0;
};
