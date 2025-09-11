---
type: entry
section: platforms
subsection: android
rank: 2
importance: 4
anchor: support-for-devices-with-16kb-page-sizes
title: Support for devices with 16KB page sizes
text: |
  A computer has some tricks in its sleeve in order to handle gigabytes of memory. One way it does it is to ["page" memory](https://en.wikipedia.org/wiki/Page_(computer_memory)) in discrete blocks. Paging makes it easier to quickly know where to find data, as the system can quickly jump to the right page to search for a specific address.

  Pages can come in multiple sizes, depending on the platform. Since its inception, Android only supported 4KB page sizes, but the Android team [announced](https://developer.android.com/guide/practices/page-sizes) compatibilty with 16KB page sizes from Android 15 onwards. Developers should note though that Google stated, starting on November 1st, 2025, that Google Play will require all new submitted apps targeting Android 15 to support 16KB page sizes.

  Fortunately, we got your back. Godot 4.5 is ready and supports this feature.
contributors:
- name: Fredia Huya-Kouadio
  github: m4gr3d
read_more: https://github.com/godotengine/godot/pull/106358
inverted: true
---
