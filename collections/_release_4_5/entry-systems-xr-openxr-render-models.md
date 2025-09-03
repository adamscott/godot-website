---
type: entry
section: systems
subsection: XR
rank: 2
importance: 3
anchor: openxr-render-models
title: OpenXR render models
text: |
  Godot added support for the `XR_EXT_render_model` and `XR_EXT_interaction_render_model` extensions introduced in OpenXR.

  These extensions, when enabled and supported, give an application access to fully animated models of the controllers currently held by users, including tracking data for these controllers. This means Meta Quest 3S and Pico 4 Ultra users will see their respective controllers in their hands without extra effort from the developer.

  In order to use this feature in your game, you need to add <code class="highlight"><span class="enginetype">OpenXRRenderModels</span></code> as a child node of the <code class="highlight"><span class="enginetype">XROrigin3D</span></code> node. For more information, [please see the docs](https://docs.godotengine.org/en/4.5/tutorials/xr/openxr_render_models.html).
contributors:
- name: BastiaanOlij
  github: BastiaanOlij
video_poster: /storage/releases/4.5/video/godot_openxr_render_models.webp
video_src: /storage/releases/4.5/video/godot_openxr_render_models.webm
media_position: right
read_more: https://github.com/godotengine/godot/pull/107388
content_creator: "[@mux213](https://bsky.app/profile/mux213.bsky.social)"
inverted: true
---
