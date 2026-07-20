---
title: Add CSV export to the reports page
date: 2026-07-05
status: open
priority: low
category: feature-request
reporter: Operations Team
tags:
  - reports
  - export
  - data
description: The reports page currently only supports on-screen viewing. Operations need to export data to CSV for use in Excel-based workflows and monthly stakeholder reports.
---

## Feature Request

Add a **Download CSV** button to the `/reports` page that exports the currently displayed data set.

## Acceptance Criteria

- [ ] A "Download CSV" button appears in the report toolbar
- [ ] Clicking the button downloads a `.csv` file named `report-{YYYY-MM-DD}.csv`
- [ ] The CSV includes all columns visible in the current table view, in the same order
- [ ] Applied filters are respected (export only filtered rows, not all rows)
- [ ] Numbers and dates are formatted consistently (ISO 8601 for dates)
- [ ] Large exports (> 10,000 rows) are streamed to avoid memory pressure

## Nice to Have

- Excel-friendly UTF-8 BOM prefix so accented characters render correctly
- Option to export as XLSX in addition to CSV

## Notes

Consider using a server-side stream response (`Content-Disposition: attachment`) rather than building the file in the browser to handle large datasets gracefully.
