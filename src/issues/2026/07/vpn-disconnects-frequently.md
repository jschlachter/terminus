---
title: VPN client disconnects every 30–60 minutes
date: 2026-07-20
status: open
priority: high
category: it-problem
reporter: Tom Baxter
assignee: IT Support
tags:
  - vpn
  - networking
  - remote-work
description: Multiple remote employees report that the VPN client drops the connection unpredictably, interrupting active work sessions and requiring a manual reconnect.
---

## Issue Description

Several remote employees (at least 6 confirmed) are experiencing automatic disconnections from the corporate VPN approximately every 30–60 minutes. The problem began around 2026-07-18 and coincided with a firewall firmware update.

## Affected Users

| Name | Location | OS |
|---|---|---|
| Tom Baxter | Remote | Windows 11 |
| Lisa Monroe | Remote | macOS 14 |
| Amir Patel | Remote | Windows 11 |
| Chloe Kim | Remote | Ubuntu 22.04 |

## Steps to Reproduce

1. Connect to the VPN using the standard GlobalProtect client
2. Work normally for 30–60 minutes
3. Connection drops; all network traffic through VPN is interrupted

## Logs

```
[2026-07-20 09:42:11] INFO  Tunnel interface up
[2026-07-20 10:14:53] WARN  Keepalive timeout after 30s
[2026-07-20 10:15:23] ERROR Tunnel disconnected (reason: timeout)
```

## Likely Cause

The firewall firmware update on 2026-07-18 may have changed the default idle-session timeout from 120 minutes to 30 minutes.

## Requested Action

Review firewall session timeout settings and restore to pre-update values or increase to ≥ 120 minutes.
