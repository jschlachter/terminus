export const prerender = false;

import type { APIRoute } from 'astro';
import { mkdir, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

function toYamlString(value: string): string {
  // Wrap in double-quoted YAML string if it contains special chars
  if (/[:#\[\]{},&*?|<>=!%@`]|^[-?:]/.test(value) || value.includes('"') || value.includes("'") || value.includes('\n')) {
    return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return value;
}

export const POST: APIRoute = async ({ request }) => {
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid form data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const title = (data.get('title') as string | null)?.trim() ?? '';
  const date = (data.get('date') as string | null)?.trim() ?? '';
  const startTime = (data.get('startTime') as string | null)?.trim() ?? '';
  const endTime = (data.get('endTime') as string | null)?.trim() ?? '';
  const location = (data.get('location') as string | null)?.trim() ?? '';
  const description = (data.get('description') as string | null)?.trim() ?? '';
  const category = (data.get('category') as string | null)?.trim() ?? '';
  const body = (data.get('body') as string | null)?.trim() ?? '';

  if (!title || !date || !startTime || !endTime) {
    return new Response(JSON.stringify({ error: 'title, date, startTime, and endTime are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Validate date format (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return new Response(JSON.stringify({ error: 'Invalid date format.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Validate category
  const validCategories = ['meeting', 'workshop', 'social', 'deadline', ''];
  if (!validCategories.includes(category)) {
    return new Response(JSON.stringify({ error: 'Invalid category.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

  const [year, month] = date.split('-');

  // Build YAML frontmatter
  const frontmatterLines = [
    '---',
    `title: ${toYamlString(title)}`,
    `date: ${date}`,
    `startTime: "${startTime}"`,
    `endTime: "${endTime}"`,
  ];
  if (location) frontmatterLines.push(`location: ${toYamlString(location)}`);
  if (description) frontmatterLines.push(`description: ${toYamlString(description)}`);
  if (category) frontmatterLines.push(`category: ${category}`);
  frontmatterLines.push('---');

  const fileContent = body
    ? `${frontmatterLines.join('\n')}\n\n${body}\n`
    : `${frontmatterLines.join('\n')}\n`;

  const dir = join(process.cwd(), 'src', 'events', year, month);
  const filePath = join(dir, `${slug}.md`);

  // Check for existing file to avoid accidental overwrite
  try {
    await access(filePath);
    return new Response(JSON.stringify({ error: `An event file already exists at ${year}/${month}/${slug}.md. Choose a different title.` }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    // File does not exist — safe to create
  }

  try {
    await mkdir(dir, { recursive: true });
    await writeFile(filePath, fileContent, 'utf-8');
  } catch (err) {
    console.error('Failed to write event file:', err);
    return new Response(JSON.stringify({ error: 'Failed to write event file.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true, slug, year, month }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
