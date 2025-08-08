---
type: entry
section: general
subsection: editor
rank: 1
importance: 4
anchor: drop-preload-resources-as-uid
title: Drop preload Resource as UID
blockquote: TODO
text: |
  With [Godot 4.4](https://godotengine.org/releases/4.4/#universal-uid-support), we introduced UIDs in order to prevent broken paths.

  We now extended this concept to scripts, as it is now possible to preload resources by their UID.

  By using UIDs instead of paths for preloading, your scripts will be more resilient, wherever the resources you're preloading are in your project.
contributors:
  - name: Tomasz Chabora
    github: KoBeWi
read_more: https://github.com/godotengine/godot/pull/99094
---
