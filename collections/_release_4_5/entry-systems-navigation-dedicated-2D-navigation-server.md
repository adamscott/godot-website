---
type: entry
section: systems
subsection: navigation
rank: 0
importance: 3
anchor: dedicated-2d-navigation-server
title: Dedicated 2D navigation server
text: |
  Ever since it’s introduction in Godot 4.0, users and navigation nodes interfaced `NavigationServer2D` for all their 2D-pathfinding needs. But what if I told you that `NavigationServer2D` feels… _sus_. It’s hiding something.

  Until 4.5, well, it **was** _sus_. That’s because we finally managed to create a dedicated 2D navigation server.

  Before this release, `NavigationServer2D` was pretty much just a proxy for `NavigationServer3D`. That’s because we figured we could reuse the 3D logic for it, as 2D navigation can ultimately be represented in 3D by constraining everything in two axis.

  Though, this had an important caveat. Namely, pure 2D games required an export template that had 3D support. That would obviously bump the final export size of their game.

  From now on, users will be able to tweak their 2D and 3D navigation servers independently.
contributors:
- name: A Thousand Ships
  github: AThousandShips
read_more: https://github.com/godotengine/godot/pull/101504
---
