---
title: Global search returns no results for partial matches
date: 2026-07-17
status: open
priority: medium
category: app-problem
reporter: Jamie Thornton
tags:
  - search
  - ux
  - regression
description: The global search bar only matches exact, whole-word queries. Typing part of a word (e.g. "sprin" for "sprint") returns zero results, breaking the expected typeahead behaviour.
---

## Steps to Reproduce

1. Click the global search bar in the top navigation
2. Type `sprin` (partial word)
3. Observe zero results returned

## Expected Behaviour

Results for "sprint", "spring cleaning", etc. should appear as the user types.

## Actual Behaviour

The search returns zero results for any partial string. Only full exact-match queries return results.

## Likely Cause

A recent migration from full-text search (PostgreSQL `tsvector`) to a basic `WHERE name = ?` query removed wildcard support. The fix should use `ILIKE '%?%'` or restore the full-text index.

## Regression

Working before v2.4.0 (deployed 2026-07-10). Breaking change introduced in the search refactor in PR #318.

## Proposed Fix

```sql
-- Replace:
WHERE name = $1

-- With:
WHERE name ILIKE '%' || $1 || '%'
```

Or restore the `pg_trgm` trigram index for better performance on large tables.
