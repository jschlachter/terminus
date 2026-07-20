---
title: Add dark mode support to the dashboard
date: 2026-07-10
status: open
priority: medium
category: feature-request
reporter: Priya Nair
tags:
  - ui
  - accessibility
  - dashboard
description: Users have requested a dark mode toggle. Several team members work late shifts and find the white background straining on their eyes.
---

## Feature Request

Add a dark/light mode toggle to the user dashboard. The preference should be persisted per user account.

## Motivation

- Reduced eye strain during evening and low-light usage
- Accessibility compliance (WCAG 2.1 contrast ratios for both modes)
- Popular request — 14 upvotes on the internal feedback board

## Proposed Solution

1. Introduce a `prefers-color-scheme` CSS media query as the default
2. Allow users to override with a manual toggle in their profile settings
3. Store the preference in `localStorage` for unauthenticated pages; in the user profile for authenticated pages

## Acceptance Criteria

- [ ] Light and dark themes are visually consistent across all pages
- [ ] Toggle is accessible via keyboard
- [ ] Preference persists across sessions
- [ ] No flash of unstyled content (FOUC) on page load
