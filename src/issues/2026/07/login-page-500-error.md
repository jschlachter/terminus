---
title: Login page throws 500 on invalid credentials
date: 2026-07-18
status: open
priority: critical
category: app-problem
reporter: Sarah Chen
assignee: Dev Team
dueDate: "2026-07-22"
tags:
  - auth
  - backend
  - production
description: Submitting incorrect credentials on the login form causes a 500 Internal Server Error instead of a validation message. Affects all users.
---

## Steps to Reproduce

1. Navigate to `/login`
2. Enter a valid email address with an incorrect password
3. Click **Sign In**
4. Observe a 500 Internal Server Error page instead of an inline validation error

## Expected Behaviour

The login form should display an inline error message: "Invalid email or password."

## Actual Behaviour

The server returns an unhandled 500 error. The stack trace is exposed in the response body in non-production environments.

## Impact

- All users are affected when entering incorrect credentials
- Error details are potentially exposed to end users
- Regression introduced in the v2.4.1 deploy on 2026-07-17

## Additional Context

Error log excerpt:

```
TypeError: Cannot read properties of undefined (reading 'compareSync')
  at AuthService.validateUser (auth.service.ts:42)
  at async AuthController.login (auth.controller.ts:18)
```

The `user` object returned from `findByEmail` is `undefined` when no match exists; the null check was removed in PR #341.
