export const prerender = false;

import type { APIRoute } from 'astro';
import { writeFile, access } from 'node:fs/promises';
import { join, sep } from 'node:path';

function toYamlString(value: string): string {
  if (/[:#\[\]{},&*?|<>=!%@`]|^[-?:]/.test(value) || value.includes('"') || value.includes("'") || value.includes('\n')) {
    return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return value;
}

export const PUT: APIRoute = async ({ request }) => {
  let data: {
    id?: string; title?: string; date?: string; startTime?: string;
    endTime?: string; location?: string; description?: string; category?: string; body?: string;
  };
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const id = data.id?.trim() ?? '';
  const title = data.title?.trim() ?? '';
  const date = data.date?.trim() ?? '';
  const startTime = data.startTime?.trim() ?? '';
  const endTime = data.endTime?.trim() ?? '';
  const location = data.location?.trim() ?? '';
  const description = data.description?.trim() ?? '';
  const category = data.category?.trim() ?? '';
  const body = data.body?.trim() ?? '';

  if (!id) {
    return new Response(JSON.stringify({ error: 'Event id is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Prevent path traversal: id must only contain alphanumerics, hyphens, and forward slashes
  if (!/^[\w/-]+$/.test(id)) {
    return new Response(JSON.stringify({ error: 'Invalid event id.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

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

  const filePath = join(process.cwd(), 'src', 'events', `${id}.md`);

  // Ensure the resolved path stays within src/events/
  const eventsDir = join(process.cwd(), 'src', 'events');
  if (!filePath.startsWith(eventsDir + sep) && filePath !== eventsDir) {
    return new Response(JSON.stringify({ error: 'Invalid event id.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Verify the file exists before overwriting
  try {
    await access(filePath);
  } catch {
    return new Response(JSON.stringify({ error: 'Event not found.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

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

  try {
    await writeFile(filePath, fileContent, 'utf-8');
  } catch (err) {
    console.error('Failed to write event file:', err);
    return new Response(JSON.stringify({ error: 'Failed to update event file.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
