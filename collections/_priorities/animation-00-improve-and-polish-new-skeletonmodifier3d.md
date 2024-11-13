---
last_updated: "2024-11-30"
category: animation
rank: 0
created: "2024-11-30"
stage:
  # Must be dates (YYYY-MM-DD), empty if not there yet.
  planning: ""
  ongoing: ""
  done: ""
anchor: "improve-and-polish-new-skeletonmodifier3d"
title: "Improve and polish new SkeletonModifier3D"
description: |
  The `SkeletonModifier3D` abstract node [introduced in 4.3](https://godotengine.org/releases/4.3/#animation-skeletonmodifier3d-node) helps users to modify and add new functionality to bones via script. We want to build upon that new structure to add new features to it. We intend to improve IK with proper limits and add spring bone support.
details:
  - type: comment
    content: |
      We identified three features that we wish to add
      - Add a bone constraint (based on the Blender spec)
      - Add spring bones (based on the VRM1 spec)
      - Add a bone expander (to be able to change the local scale)
---
