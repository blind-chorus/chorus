# @blind-dsai/ui-android

Jetpack Compose implementation of the Chorus design system. Early pilot — Button (full spec) and Chip (filter + tag) ported so far; the rest of the families in [`schema/components/`](https://github.com/blind-dsai/chorus/tree/main/schema/components) are not yet implemented.

Pairs with [`@blind-dsai/tokens-android`](../tokens-android) (Gradle module `chorus-tokens`), which generates color / spacing / typography sources from the shared `schema/tokens/*.json`.

> **License:** MIT. See [`../../LICENSE`](../../LICENSE).

## Install (Gradle)

Include both modules in `settings.gradle.kts`:

```kotlin
includeBuild("path/to/chorus/packages/tokens-android")
includeBuild("path/to/chorus/packages/ui-android")
```

Then depend on `chorus-ui` in your app module:

```kotlin
dependencies {
  implementation("dev.blinddsai.chorus:chorus-ui:<version>")
}
```

`chorus-ui` transitively depends on `chorus-tokens`.

## Usage

```kotlin
import dev.blinddsai.chorus.ui.ChorusButton
import dev.blinddsai.chorus.ui.theme.ChorusTheme

@Composable
fun Example() {
  ChorusTheme {
    ChorusButton(
      label = "Save",
      onClick = { /* ... */ },
    )
  }
}
```

`ChorusTheme` wraps the palette in a `CompositionLocal`, so child Composables resolve colors from the shared token system instead of Material defaults. The token palette is the single source of truth — pull from `chorus-tokens` rather than hard-coding hex values.

## Token regeneration

After editing `schema/tokens/*.json` in the [Chorus monorepo](https://github.com/blind-dsai/chorus):

```bash
node packages/tokens-android/scripts/codegen.mjs
```

Generated sources land in `packages/tokens-android/chorus-tokens/src/main/kotlin/dev/blinddsai/chorus/tokens/generated/`. CI runs `packages/tokens-android/scripts/check.mjs` and fails if the JSON changed without the matching `generated/*` being regenerated.

## Pairs with

- [`@blind-dsai/ui`](../ui) — React implementation. Same schema, same tokens.
- [`@blind-dsai/ui-ios`](../ui-ios) — SwiftUI implementation.
