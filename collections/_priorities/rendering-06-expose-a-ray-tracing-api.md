---
last_updated: "2024-11-30"
category: rendering
rank: 6
created: "2024-11-30"
stage:
  # Must be dates (YYYY-MM-DD), empty if not there yet.
  planning: ""
  ongoing: ""
  done: ""
anchor: "expose-a-ray-tracing-api"
title: "Expose a ray tracing API and eventually use it for built in effects"
description: |
  Hardware ray tracing is slowly becoming more widespread. Soon it will be common for all desktop computers to support hardware ray tracing and soon after mobile devices will as well. We want to expose an API for hardware ray tracing through our `RenderingDevice` so that users can begin to make use of it. Then, eventually, we want to use that API to leverage hardware ray tracing in the _Forward+_ renderer.
details:
---
