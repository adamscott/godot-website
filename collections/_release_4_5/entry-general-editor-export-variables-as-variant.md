---
type: entry
section: general
subsection: editor
rank: 5
importance: 3
anchor: export-variables-as-variant
title: Export variables as `Variant`
text: |
  With this new update, it is now possible to export variables as <code class="highlight"><span class="enginetype">Variant</span></code>.

  Previously, a variable could only be exported as a <code class="highlight"><span class="enginetype">Variant</span></code> if it had an initialized value. Also, the editor would stick to the actual type of said value, making it impossible to change the value to another supported <code class="highlight"><span class="enginetype">Variant</span></code> type, such as a <code class="highlight"><span class="enginetype">String</span></code> or <code class="highlight"><span class="enginetype">Color</span></code>.

  Now, if the exported variable is of type <code class="highlight"><span class="enginetype">Variant</span></code>, the editor reacts accordingly, permitting the user to assign any compatible <code class="highlight"><span class="enginetype">Variant</span></code> value. There’s even a nifty type selector that changes the input widget accordingly.
contributors:
- name: Tomasz Chabora
  github: KoBeWi
read_more: https://github.com/godotengine/godot/pull/89324
---
