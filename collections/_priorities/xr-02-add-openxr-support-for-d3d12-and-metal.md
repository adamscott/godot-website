---
last_updated: "2024-11-30"
category: xr
rank: 2
created: "2024-11-30"
stage:
  # Must be dates (YYYY-MM-DD), empty if not there yet.
  planning: "2024-11-30"
  ongoing: "2024-11-30"
  done: ""
anchor: "add-openxr-support-for-d3d12-and-metal"
title: "Add OpenXR support for DirectX12 and Metal"
description: |
  Currently, when using OpenXR, you can use the Compatibility renderer or the _Forward+_ and _Mobile_ renderers, but only when using Vulkan. We want to add support for DirectX12 and Metal so that users on all platforms can benefit from OpenXR.
details:
  - type: prs
    content: |
      - [Openxr KHR metal enable #98872](https://github.com/godotengine/godot/pull/98872)
---
