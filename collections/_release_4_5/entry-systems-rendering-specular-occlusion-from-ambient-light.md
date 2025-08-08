---
type: entry
section: systems
subsection: rendering
rank: 0
importance: 2
anchor: specular-occlusion-from-ambient-light
title: Specular occlusion from ambient light
blockquote: Added realism for cheap
text: |
  Ever wondered why some objects would eerily shine as if they were lit in an occluded area where they shouldn't?

  That's because the calculation of the exposition doesn't take into account ambient light and other parameters.

  Fortunately, our renderer has now a cheap option for specular occlusion that should fix this issue.

  For existing projects where it could break the look, don't fret. A toggle is available in the project settings
contributors:
  - name: Lander
    github: lander-vr
read_more: https://github.com/godotengine/godot/pull/106145

---
