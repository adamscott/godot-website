---
type: entry
section: highlights
rank: 2
importance: 2
anchor: script-backtracing
title: Script backtracing
blockquote: How deep the rabbit hole goes?
text: |
  Using the Release build target has been a blessing and a curse for numerous developers.

  It permits the game to continue running even if it encountered an unexpected error, enhancing the players' experience. But it prevents the developers to get crucial information that is sorely needed to iron out issues.

  That's why we're introducing custom loggers and script backtracing.

  Custom loggers permit developers to intercept log messages and errors. That enables the possibility of creating a bug reporting tool from within your game.

  Script backtracing, on the other hand, give developers the exact detail on where an issue happened in the code. Those are available in the Release build as well. (just make sure that the _Debug > Settings > GDScript > Always Track Call Stacks_ project setting is enabled)
contributors:
  - name: Mikael Hermansson
    github: mihe
  - name: Juan Linietsky
    github: reduz
read_more: https://github.com/godotengine/godot/pull/91006
---
