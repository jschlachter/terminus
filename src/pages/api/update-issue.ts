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
    id?: string; title?: string; date?: string; status?: string;
    priority?: string; category?: string; reporter?: string; assignee?: string;
    dueDate?: string; tags?: string; description?: string; body?: string;
    resolvedDate?: string; resolvedBy?: string; resolutionType?: string;
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
  const status = data.status?.trim() ?? '';
  const priority = data.priority?.trim() ?? '';
  const category = data.category?.trim() ?? '';
  const reporter = data.reporter?.trim() ?? '';
  const assignee = data.assignee?.trim() ?? '';
  const dueDate = data.dueDate?.trim() ?? '';
  const tagsRaw = data.tags?.trim() ?? '';
  const description = data.description?.trim() ?? '';
  const body = data.body?.trim() ?? '';
  const resolvedDate = data.resolvedDate?.trim() ?? '';
  const resolvedBy = data.resolvedBy?.trim() ?? '';
  const resolutionType = data.resolutionType?.trim() ?? '';

  if (!id) {
    return new Response(JSON.stringify({ error: 'Issue id is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Prevent path traversal
  if (!/^[\w/-]+$/.test(id)) {
    return new Response(JSON.stringify({ error: 'Invalid issue id.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!title || !date || !status) {
    return new Response(JSON.stringify({ error: 'title, date, and status are required.' }), {
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

  if (resolvedDate && !/^\d{4}-\d{2}-\d{2}$/.test(resolvedDate)) {
    return new Response(JSON.stringify({ error: 'Invalid resolved date format.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const validResolutionTypes = ['fixed', 'wont-fix', 'duplicate', 'workaround', 'by-design', ''];
  if (!validResolutionTypes.includes(resolutionType)) {
    return new Response(JSON.stringify({ error: 'Invalid resolution type.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const filePath = join(process.cwd(), 'src', 'issues', `${id}.md`);

  const issuesDir = join(process.cwd(), 'src', 'issues');
  if (!filePath.startsWith(issuesDir + sep) && filePath !== issuesDir) {
    return new Response(JSON.stringify({ error: 'Invalid issue id.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await access(filePath);
  } catch {
    return new Response(JSON.stringify({ error: 'Issue not found.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Parse comma-separated tags
  const tags = tagsRaw
    ? tagsRaw.split(',').map((t: string) => t.trim()).filter(Boolean)
    : [];

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
    tags.forEach((tag: string) => frontmatterLines.push(`  - ${toYamlString(tag)}`));
  }
  if (description) frontmatterLines.push(`description: ${toYamlString(description)}`);
  if (resolvedDate) frontmatterLines.push(`resolvedDate: "${resolvedDate}"`);
  if (resolvedBy) frontmatterLines.push(`resolvedBy: ${toYamlString(resolvedBy)}`);
  if (resolutionType) frontmatterLines.push(`resolutionType: ${resolutionType}`);
  frontmatterLines.push('---');

  const fileContent = body
    ? `${frontmatterLines.join('\n')}\n\n${body}\n`
    : `${frontmatterLines.join('\n')}\n`;

  try {
    await writeFile(filePath, fileContent, 'utf-8');
  } catch (err) {
    console.error('Failed to write issue file:', err);
    return new Response(JSON.stringify({ error: 'Failed to update issue file.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
