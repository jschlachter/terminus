export const prerender = false;

import type { APIRoute } from 'astro';
import { mkdir, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

function toYamlString(value: string): string {
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
  const status = (data.get('status') as string | null)?.trim() ?? 'open';
  const priority = (data.get('priority') as string | null)?.trim() ?? '';
  const category = (data.get('category') as string | null)?.trim() ?? '';
  const reporter = (data.get('reporter') as string | null)?.trim() ?? '';
  const assignee = (data.get('assignee') as string | null)?.trim() ?? '';
  const dueDate = (data.get('dueDate') as string | null)?.trim() ?? '';
  const tagsRaw = (data.get('tags') as string | null)?.trim() ?? '';
  const description = (data.get('description') as string | null)?.trim() ?? '';
  const body = (data.get('body') as string | null)?.trim() ?? '';

  if (!title || !date) {
    return new Response(JSON.stringify({ error: 'title and date are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return new Response(JSON.stringify({ error: 'Invalid date format.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
  if (!validStatuses.includes(status)) {
    return new Response(JSON.stringify({ error: 'Invalid status.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const validPriorities = ['low', 'medium', 'high', 'critical', ''];
  if (!validPriorities.includes(priority)) {
    return new Response(JSON.stringify({ error: 'Invalid priority.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const validCategories = ['it-problem', 'app-problem', 'feature-request', 'doc-request', 'other', ''];
  if (!validCategories.includes(category)) {
    return new Response(JSON.stringify({ error: 'Invalid category.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    return new Response(JSON.stringify({ error: 'Invalid due date format.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Parse comma-separated tags into an array
  const tags = tagsRaw
    ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

  const [year, month] = date.split('-');

  const frontmatterLines = [
    '---',
    `title: ${toYamlString(title)}`,
    `date: ${date}`,
    `status: ${status}`,
  ];
  if (priority) frontmatterLines.push(`priority: ${priority}`);
  if (category) frontmatterLines.push(`category: ${category}`);
  if (reporter) frontmatterLines.push(`reporter: ${toYamlString(reporter)}`);
  if (assignee) frontmatterLines.push(`assignee: ${toYamlString(assignee)}`);
  if (dueDate) frontmatterLines.push(`dueDate: "${dueDate}"`);
  if (tags.length > 0) {
    frontmatterLines.push('tags:');
    tags.forEach(tag => frontmatterLines.push(`  - ${toYamlString(tag)}`));
  }
  if (description) frontmatterLines.push(`description: ${toYamlString(description)}`);
  frontmatterLines.push('---');

  const fileContent = body
    ? `${frontmatterLines.join('\n')}\n\n${body}\n`
    : `${frontmatterLines.join('\n')}\n`;

  const dir = join(process.cwd(), 'src', 'issues', year, month);
  const filePath = join(dir, `${slug}.md`);

  try {
    await access(filePath);
    return new Response(JSON.stringify({ error: `An issue file already exists at ${year}/${month}/${slug}.md. Choose a different title.` }), {
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
    console.error('Failed to write issue file:', err);
    return new Response(JSON.stringify({ error: 'Failed to write issue file.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true, slug, year, month }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
