# @blind-dsai/ui-ios

SwiftUI implementation of the Chorus design system. Early pilot — Button (full spec) and Chip (filter + tag) ported so far; the rest of the families in [`schema/components/`](https://github.com/blind-dsai/chorus/tree/main/schema/components) are not yet implemented.

Pairs with [`@blind-dsai/tokens-ios`](../tokens-ios) (Swift Package `ChorusTokens`), which generates color / spacing / typography sources from the shared `schema/tokens/*.json`.

> **License:** MIT. See [`../../LICENSE`](../../LICENSE).

## Install (Swift Package Manager)

Add the package via Xcode (File → Add Packages…) pointing at `https://github.com/blind-dsai/chorus`, or in `Package.swift`:

```swift
.package(url: "https://github.com/blind-dsai/chorus.git", branch: "main"),
```

Then depend on `ChorusUI`:

```swift
.target(name: "MyApp", dependencies: [
  .product(name: "ChorusUI", package: "chorus"),
])
```

`ChorusUI` transitively depends on `ChorusTokens` — no separate package needed.

## Usage

```swift
import SwiftUI
import ChorusUI

struct Example: View {
  var body: some View {
    VStack {
      ChorusButton(label: "Save", action: {})
    }
  }
}
```

Themed colors resolve via `@Environment(\.colorScheme)` and `ChorusColors.themed(for:)`. The token palette is the single source of truth — pull from `ChorusTokens` rather than hard-coding hex values.

## Token regeneration

After editing `schema/tokens/*.json` in the [Chorus monorepo](https://github.com/blind-dsai/chorus):

```bash
node packages/tokens-ios/scripts/codegen.mjs
```

Generated sources land in `packages/tokens-ios/Sources/ChorusTokens/Generated/`. CI runs `packages/tokens-ios/scripts/check.mjs` and fails if the JSON changed without the matching `Generated/*` being regenerated.

## Pairs with

- [`@blind-dsai/ui`](../ui) — React implementation. Same schema, same tokens.
- [`@blind-dsai/ui-android`](../ui-android) — Compose implementation.
