---
category: physics
rank: 1
stage:
  # Must be dates (YYYY-MM-DD), empty if not there yet.
  planning: ""
  ongoing: ""
  done: ""
created: "2024-11-30"
last_updated: "2024-11-30"
anchor: "adapt-the-way-godot-exposes-physics-to-mirror-jolt"
title: "Adapt the way Godot exposes physics to mirror Jolt"
description: |
  As much as our nodes are made to be compatible with multiple physics engines, the existing integration of Jolt (via the [godot-jolt](https://github.com/godot-jolt/godot-jolt) add-on) is not optimal, as there are numerous features that can’t be implemented in Godot due to the current way the system works. In addition to integrating Jolt as the default 3D physics engine, we want to modernize our node bindings in order to fully exploit the new library.
details: |
  <div class="detail-block note" markdown=1>
    We do expect it will create some compatibility issues.
  </div>
---
