---
last_updated: "2024-11-30"
category: core
rank: 3
created: "2024-11-30"
stage:
  # Must be dates (YYYY-MM-DD), empty if not there yet.
  planning: ""
  ongoing: ""
  done: ""
anchor: "make-optimizations-throughout-the-core"
title: "Make optimizations throughout the core"
description: |
  Much of the engine would benefit from a careful evaluation of the current performance bottlenecks and improvements to ensure that it is running as fast as possible. Godot 4.0 drastically improved the overall architecture of Godot, but there is still a lot of legacy code that is not benefitting from the architectural improvements. We need to seek out those areas and fix them.
details:
  - type: note
    content: |
      To aid in this, we want to create more educational materials on profiling performance issues (both for CPU and GPU workloads).
---
