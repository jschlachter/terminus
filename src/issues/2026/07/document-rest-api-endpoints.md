---
title: REST API endpoints are undocumented
date: 2026-07-08
status: in-progress
priority: medium
category: doc-request
reporter: Dev Team
assignee: Nina Okafor
tags:
  - api
  - documentation
  - developer-experience
description: The REST API has grown to over 40 endpoints but lacks any formal documentation. New developers and integration partners have difficulty discovering available routes and required parameters.
---

## Background

The project's REST API currently has no auto-generated or hand-written documentation. Developers discover endpoints by reading controller source files, which slows onboarding and increases support overhead.

## Scope of Work

1. **Audit** — List all existing endpoints across all controllers
2. **Annotate** — Add OpenAPI 3.0 decorators (or equivalent) to each route
3. **Generate** — Configure Swagger UI to serve at `/api/docs` in development
4. **Publish** — Export the OpenAPI spec as `openapi.json` to the `public/` folder

## Endpoints Requiring Documentation (partial list)

| Method | Path | Status |
|---|---|---|
| POST | `/api/auth/login` | ⬜ Not started |
| POST | `/api/auth/logout` | ⬜ Not started |
| GET | `/api/users` | ⬜ Not started |
| GET | `/api/users/:id` | ✅ Done |
| PUT | `/api/users/:id` | ⬜ Not started |
| GET | `/api/reports` | ⬜ Not started |

## Notes

- Prioritise auth and user endpoints first as they are most commonly queried
- Include request body schemas, response shapes, and error codes for each route
