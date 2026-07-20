export const prerender = false;

import type { APIRoute } from 'astro';
import { unlink } from 'node:fs/promises';
import { join, sep } from 'node:path';

export const DELETE: APIRoute = async ({ request }) => {
  let body: { id?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const id = body.id?.trim() ?? '';
  if (!id) {
    return new Response(JSON.stringify({ error: 'Issue id is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Prevent path traversal: id must only contain alphanumerics, hyphens, and forward slashes
  if (!/^[\w/-]+$/.test(id)) {
    return new Response(JSON.stringify({ error: 'Invalid issue id.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const filePath = join(process.cwd(), 'src', 'issues', `${id}.md`);

  // Ensure the resolved path stays within src/issues/
  const issuesDir = join(process.cwd(), 'src', 'issues');
  if (!filePath.startsWith(issuesDir + sep) && filePath !== issuesDir) {
    return new Response(JSON.stringify({ error: 'Invalid issue id.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await unlink(filePath);
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') {
      return new Response(JSON.stringify({ error: 'Issue not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: 'Failed to delete issue.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
