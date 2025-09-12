---
type: entry
section: platforms
subsection: android
rank: 2
importance: 4
anchor: support-for-devices-with-16kb-page-sizes
title: Support for devices with 16KB page sizes
text: |
  Computers have a few tricks up their sleeves to handle gigabytes of memory. One such trick is ["paging" memory](https://en.wikipedia.org/wiki/Page_(computer_memory)) in discrete blocks, so that the system can quickly jump to it when looking for a specific address.

  Pages can come in multiple sizes depending on the platform. Since its inception, Android only supported 4KB page sizes, but the Android team [recently announced](https://developer.android.com/guide/practices/page-sizes) compatibility with 16KB page sizes from Android 15 onwards. Developers should note, though, that starting on 1 November 2025, Google Play will require all new submitted apps targeting Android 15 to support 16KB page sizes.

  Fortunately, we’ve got your back; Godot 4.5 supports this feature out of the box.
contributors:
- name: Fredia Huya-Kouadio
  github: m4gr3d
read_more: https://github.com/godotengine/godot/pull/106358
inverted: true
---
