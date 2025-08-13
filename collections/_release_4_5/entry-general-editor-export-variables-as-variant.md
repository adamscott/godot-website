---
type: entry
section: general
subsection: editor
rank: 5
importance: 3
anchor: export-variables-as-variant
title: Export variables as `Variant`
text: |
  With this new update, it is now possible to export variables as `Variant`.

  Previously, a variable could only be exported as a `Variant` if it had an initialized value. Also, the editor would stick to the actual type of that said value, making it not possible to change the value to another supported `Variant` type, such as a `String` or `Color`.

  Now, if the exported variable is of type `Variant`, the editor reacts accordingly, permitting the user to assign any compatible `Variant` value.
contributors:
  - name: Tomasz Chabora
    github: KoBeWi
read_more: https://github.com/godotengine/godot/pull/89324
---
