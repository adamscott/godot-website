---
type: entry
section: general
subsection: core
rank: 2
importance: 3
anchor: duplicate-at-ease-with-expected-results
title: Duplicate at ease with expected results
blockquote: As deep as you wish
text: |
  For a long time, even though `Resource.duplicate()` has a `deep` parameter, people realized that setting it to `true` doesn’t always perform in a reliable and predictable way. [Notably](https://github.com/godotengine/godot/issues/74918), it does not duplicate subresources stored inside `Array` or `Dictionary` properties.

  The new `Resource.duplicate_deep()` method give users full control [over what gets duplicated or not](https://docs.godotengine.org/en/4.5/classes/class_resource.html#enum-resource-deepduplicatemode).

  This new feature is the result of an overhaul of the duplication logic for objects, arrays, and dictionaries. For developers, we made sure to keep what was working and consistent intact. If you need more details, feel free to consult our new exhaustive [documentation about the duplication specification]().
contributors:
  - name: Pedro J. Estébanez
    github: RandomShaper
read_more: https://github.com/godotengine/godot/pull/100673
---
