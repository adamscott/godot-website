---
last_updated: "2024-11-30"
category: web
rank: 1
created: "2024-11-30"
stage:
  # Must be dates (YYYY-MM-DD), empty if not there yet.
  planning: "2024-11-30"
  ongoing: ""
  done: ""
anchor: "improve-loading-time-for-web-builds"
title: "Improve loading time for web builds"
description: |
  Currently, if no specific steps are taken by the game developer, resources for a game on the Web are bundled into one single .pck file. As users need to download the entire game’s assets at front, we need to find a better way to split the loading throughout the game, only when needed. This would greatly improve the starting time of the game.
details:
  - type: note
    content: |
      We need to investigate ways to solve the issue. We think a custom asynchronous filesystem could fix the issue, downloading files individually when needed.
---
