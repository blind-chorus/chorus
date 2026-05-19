package dev.blinddsai.chorus.ui.chip

import androidx.compose.foundation.Image
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.unit.dp
import dev.blinddsai.chorus.tokens.ChorusTheme
import dev.blinddsai.chorus.tokens.generated.ChorusBorderWidth
import dev.blinddsai.chorus.tokens.generated.ChorusIconSize
import dev.blinddsai.chorus.tokens.generated.ChorusLayout
import dev.blinddsai.chorus.tokens.generated.ChorusPalette
import dev.blinddsai.chorus.tokens.generated.ChorusRadius
import dev.blinddsai.chorus.tokens.generated.ChorusTypography
import dev.blinddsai.chorus.ui.internal.ChorusSurface
import dev.blinddsai.chorus.ui.internal.SurfaceShell

/**
 * Compose port of the Chorus Chip family.
 * Specs: `schema/components/chip/filter.spec.json`, `.../tag.spec.json`.
 */

@Composable
fun ChorusFilterChip(
    label: String,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    leadingIcon: Painter? = null,
    trailingIcon: Painter? = null,
    enabled: Boolean = true,
) {
    val c = ChorusTheme.colors
    val surface = if (selected) {
        ChorusSurface(c.inverseSurface, c.inverseOnSurface)
    } else {
        ChorusSurface(Color.Transparent, c.onSurface, ChorusBorderWidth.hairline to c.outlineVariant)
    }

    SurfaceShell(
        surface = surface,
        radius = ChorusRadius.full,
        minHeight = 32.dp,
        paddingBlock = ChorusLayout.Container.s2xs,
        paddingInline = ChorusLayout.Container.sm,
        onClick = onClick,
        enabled = enabled,
        modifier = modifier,
    ) {
        Row(
            horizontalArrangement = Arrangement.spacedBy(ChorusLayout.Container.s2xs, Alignment.CenterHorizontally),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            if (leadingIcon != null) {
                Image(painter = leadingIcon, contentDescription = null,
                      modifier = Modifier.size(ChorusIconSize.md))
            }
            Text(label, style = ChorusTypography.Label.sm, color = surface.labelColor, maxLines = 1)
            if (trailingIcon != null) {
                Image(painter = trailingIcon, contentDescription = null,
                      modifier = Modifier.size(ChorusIconSize.md))
            }
        }
    }
}

@Composable
fun ChorusTagChip(
    label: String,
    modifier: Modifier = Modifier,
    onDismiss: (() -> Unit)? = null,
    trailingIcon: Painter? = null,
    enabled: Boolean = true,
) {
    val c = ChorusTheme.colors
    // Tag's translucent neutral has to flip across themes so the chip
    // adapts to whichever surface sits behind it; the rest of the
    // palette is theme-resolved via ChorusTheme already.
    val background = if (isSystemInDarkTheme()) ChorusPalette.White.s200 else ChorusPalette.Black.s200
    val surface = ChorusSurface(background, c.onSurface)

    SurfaceShell(
        surface = surface,
        radius = ChorusRadius.sm,
        minHeight = 24.dp,
        paddingBlock = ChorusLayout.Container.s2xs,
        paddingInline = ChorusLayout.Container.xs,
        onClick = onDismiss,
        enabled = enabled,
        modifier = modifier,
    ) {
        Row(
            horizontalArrangement = Arrangement.spacedBy(ChorusLayout.Container.s2xs, Alignment.CenterHorizontally),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(label, style = ChorusTypography.Label.sm, color = c.onSurface, maxLines = 1)
            if (trailingIcon != null) {
                Image(painter = trailingIcon, contentDescription = null,
                      modifier = Modifier.size(ChorusIconSize.md))
            }
        }
    }
}
