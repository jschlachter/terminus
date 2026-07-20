---
title: Password reset emails not being delivered
date: 2026-07-15
status: in-progress
priority: high
category: app-problem
reporter: Marcus Webb
assignee: Jordan Ellis
dueDate: "2026-07-23"
tags:
  - email
  - auth
  - smtp
description: Users who request a password reset never receive the email. The issue started after the SMTP provider migration on 2026-07-12.
---

## Steps to Reproduce

1. Navigate to `/forgot-password`
2. Enter a registered email address
3. Click **Send Reset Link**
4. Check inbox (including spam folder) — no email arrives

## Expected Behaviour

A password reset email containing a one-time link should arrive within 2 minutes.

## Actual Behaviour

No email is delivered. The UI shows a success message, so users have no indication of the failure.

## Root Cause (Under Investigation)

Preliminary investigation shows the SMTP credentials stored in the `.env` file were not updated after migrating from Mailgun to SendGrid on 2026-07-12. The outbound email queue is silently failing.

## Next Steps

- [ ] Update `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS` in production environment
- [ ] Add error alerting for failed email delivery
- [ ] Verify SPF/DKIM records for the new provider
