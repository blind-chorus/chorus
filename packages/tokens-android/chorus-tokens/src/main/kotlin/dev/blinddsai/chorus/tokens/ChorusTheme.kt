package dev.blinddsai.chorus.tokens

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.staticCompositionLocalOf
import dev.blinddsai.chorus.tokens.generated.ChorusColors
import dev.blinddsai.chorus.tokens.generated.ChorusColorsDark
import dev.blinddsai.chorus.tokens.generated.ChorusColorsLight

private val LocalChorusColors = staticCompositionLocalOf<ChorusColors> {
    error("ChorusTheme not provided. Wrap your composables in ChorusTheme { ... }.")
}

object ChorusTheme {
    val colors: ChorusColors
        @Composable
        @ReadOnlyComposable
        get() = LocalChorusColors.current
}

/**
 * Wrap the app (or any subtree) in this composable to expose the Chorus
 * color palette to descendants via [ChorusTheme.colors]. Layout, radius,
 * typography, etc. live as top-level `object`s — they don't need to flip
 * with the color scheme so they're not part of this CompositionLocal.
 */
@Composable
fun ChorusTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    val palette = if (darkTheme) ChorusColorsDark else ChorusColorsLight
    CompositionLocalProvider(LocalChorusColors provides palette, content = content)
}
