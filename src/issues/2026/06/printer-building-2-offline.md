---
title: Shared printer on Floor 2 is offline
date: 2026-06-28
status: resolved
priority: medium
category: it-problem
reporter: Building Services
assignee: IT Support
tags:
  - printer
  - hardware
  - building-2
description: The HP LaserJet MFP on Floor 2 (IP 192.168.10.45) went offline and was showing as unreachable on the print server. Resolved by replacing a faulty network cable.
---

## Issue Description

The shared HP LaserJet M428fdn on Floor 2 stopped accepting print jobs on 2026-06-28 at approximately 10:00 AM. The printer appeared offline on the Windows print server and was unreachable via ping.

## Diagnosis

1. Confirmed the printer's power and panel display were normal (no error codes)
2. Pinged the printer's static IP `192.168.10.45` — 100% packet loss
3. Tested the network port at the wall — no link light
4. Swapped to a spare Cat6 cable — link restored immediately

## Resolution

Replaced the faulty Cat6 Ethernet cable between the printer and wall jack on Floor 2 Bay C. Print jobs resumed normally at 11:30 AM.

## Follow-up Actions

- [ ] Label the spare cable cache in the IT storage room
- [ ] Add the printer IP to the network monitoring dashboard for proactive alerting
