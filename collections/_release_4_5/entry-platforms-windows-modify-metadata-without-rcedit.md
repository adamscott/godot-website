---
type: entry
section: platforms
subsection: windows
rank: 0
importance: 2
anchor: modify-metadata-without-rcedit
title: Modify metadata without `rcedit`
blockquote: So long, `rcedit`!
text: |
  Windows `.exe` file metadata (such as a custom icon, the product name, and the company information) is stored internally as "resources".

  For years, in order to modify these resources, the Windows exporter needed to access an external Windows program: [`rcedit`](https://github.com/electron/rcedit). That made it really difficult to export for Windows on a non-Windows machine.

  That’s until now. The Windows exporter now knows how to edit the resources natively. It means you can edit Windows export metadata without a hitch, on every platform.
contributors:
  - name: pkowal1982
    github: pkowal1982
read_more: https://github.com/godotengine/godot/pull/75950
---
