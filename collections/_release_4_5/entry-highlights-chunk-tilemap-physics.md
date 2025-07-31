---
type: entry
section: highlights
rank: 5
importance: 2
anchor: chunk-tilemap-physics
title: Chunk tilemap physics
blockquote: Fusion… HA!
text: |
  Since the implementation of 2D tilemaps in Godot, physics always relied on the concept of "one tile - one body". While it works for most games, it can easily lead to performance issues on 2D scenes relying on physics as the number of bodies is extremely wasteful.

  The system has been reworked from the ground-up. Now, `TileMapLayer` physics merge cell shapes into bigger collision shapes, whenever possible.
contributors:
  - name: Gilles Roudière
    github: groud
read_more: https://github.com/godotengine/godot/pull/102662
video_poster: /storage/releases/4.5/video/godot_chunk_tilemap_physics.webp
video_src: /storage/releases/4.5/video/godot_chunk_tilemap_physics.webm
media_position: bottom
content_creator: "[@groud](https://bsky.app/profile/groud.bsky.social)"
---
