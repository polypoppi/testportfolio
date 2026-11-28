import type { APIRoute } from 'astro';
import { getSettings, getExperience, getProjects, getStories } from '../../lib/db';

// Read-only, public JSON of everything published on the site (the "headless" API).
export const GET: APIRoute = async () => {
  const [settings, experience, projects, stories] = await Promise.all([
    getSettings(),
    getExperience(),
    getProjects(),
    getStories(),
  ]);
  return Response.json(
    { ...settings, experience, projects, stories },
    { headers: { 'Cache-Control': 'public, max-age=60', 'Access-Control-Allow-Origin': '*' } },
  );
};
