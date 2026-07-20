---
title: Main dashboard takes 8–12 seconds to load
date: 2026-07-14
status: open
priority: high
category: app-problem
reporter: Rachel Foster
assignee: Backend Team
tags:
  - performance
  - dashboard
  - database
description: The main dashboard page consistently takes 8–12 seconds to render for accounts with more than 500 records. Profiling shows N+1 query issues in the summary widgets.
---

## Steps to Reproduce

1. Log in as a user with > 500 associated records
2. Navigate to the main dashboard (`/dashboard`)
3. Observe the load time in the browser DevTools Network tab

## Expected Behaviour

Dashboard should load within 1–2 seconds regardless of record count.

## Actual Behaviour

- Load time: **8–12 seconds** for large accounts
- Load time: ~900ms for new accounts with < 50 records
- Chrome DevTools shows a single blocking API call to `/api/dashboard/summary` taking 7.4s

## Profiling Results

The `/api/dashboard/summary` endpoint executes **1 + N** queries where N is the number of projects:

```
SELECT * FROM projects WHERE account_id = ?         -- 1 query
SELECT COUNT(*) FROM tasks WHERE project_id = 1     -- N queries
SELECT COUNT(*) FROM tasks WHERE project_id = 2
...
SELECT COUNT(*) FROM tasks WHERE project_id = N
```

## Proposed Fix

Replace the N+1 pattern with a single aggregated query:

```sql
SELECT p.id, p.name, COUNT(t.id) AS task_count
FROM projects p
LEFT JOIN tasks t ON t.project_id = p.id
WHERE p.account_id = ?
GROUP BY p.id, p.name
```
