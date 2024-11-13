---
category: editor
rank: 0
stage:
  # Must be dates (YYYY-MM-DD), empty if not there yet.
  planning: ""
  ongoing: ""
  done: ""
created: "2024-11-30"
last_updated: "2024-11-30"
anchor: "make-the-editor-resilient-to-file-changes"
title: "Make the editor resilient to files changed/added externally"
description: |
  Godot doesn’t know how to handle project file changes that happen on non-imported files, such as scripts, when it happens outside of the editor. This can be a common occurrence for users that use an external code editor. This can lead to numerous errors and inconveniences, such as scenes refusing to load. We intend to make this a relic of the past.
details: |
  <div class="detail-block note" markdown=1>
    The idea would be to introduce UIDs to non-imported files, such as scripts.
  </div>
---
