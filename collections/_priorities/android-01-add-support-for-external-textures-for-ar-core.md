---
last_updated: "2024-11-30"
category: android
rank: 1
created: "2024-11-30"
stage:
  # Must be dates (YYYY-MM-DD), empty if not there yet.
  planning: "2024-09-31"
  ongoing: "2024-09-31"
  done: ""
anchor: "add-support-for-external-textures-for-ar-core"
title: "Add support for external textures for AR Core"
description: |
  External textures are textures where their data comes from an external source. For AR, it means getting the camera feed (or anything that can be rendered) from the host operating system and displaying it over in Godot.
details:
  - type: note
    content: |
      Link for the [AR Core plugin for Android](https://github.com/godotvr/godot_arcore).
  - type: prs
    content: |
      - [Add external texture support (GLES3) #96982](https://github.com/godotengine/godot/pull/96982)
      - [Add external texture support (Vulkan) #97163](https://github.com/godotengine/godot/pull/97163)
---
