---
type: entry
section: systems
subsection: XR
rank: 4
importance: 4
anchor: application-spacewarp-reporting-for-duty
title: Application SpaceWarp, reporting for duty
text: |
  As mobile headset resources can be sparse, it is important to know how to optimize the compute budget. Considering XR requires a high refresh rate for a multitude of reasons, this leaves developper with a limited timeframe to render. But what if it could be possible to use frame synthesis to our advantage? We could render at half-rate, giving ourselves way more time to process, while leveraging the GPU to generate the next one.

  That’s exactly what Meta’s [Application SpaceWarp](https://developers.meta.com/horizon/blog/introducing-application-spacewarp/) does. We now support this technology with the latest release of our [OpenXR vendors plugin](https://godotengine.org/article/godot-openxr-vendors-plugin-400/), thanks to the implementation of motion vectors in the Mobile renderer.

  As OpenXR just released the multi-vendor [Frame Synthesis extension](https://registry.khronos.org/OpenXR/specs/1.1/html/xrspec.html#XR_EXT_frame_synthesis), we expect support for non Pico and Quest headsets in the future.
contributors:
- name: Logan Lang
  github: devloglogan
read_more: https://github.com/godotengine/godot/pull/100283
---
