package dev.blinddsai.chorus.ui.button

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import dev.blinddsai.chorus.tokens.ChorusTheme
import dev.blinddsai.chorus.tokens.generated.ChorusBorderWidth
import dev.blinddsai.chorus.tokens.generated.ChorusIconSize
import dev.blinddsai.chorus.tokens.generated.ChorusLayout
import dev.blinddsai.chorus.tokens.generated.ChorusRadius
import dev.blinddsai.chorus.tokens.generated.ChorusTypography
import dev.blinddsai.chorus.ui.internal.ChorusSurface
import dev.blinddsai.chorus.ui.internal.SurfaceShell

/**
 * Compose port of the Chorus standard Button.
 * Spec: `schema/components/button/standard.spec.json`.
 */
enum class ChorusButtonSize { Large, Medium, Small }
enum class ChorusButtonAppearance { Primary, Secondary, Outlined, Tertiary }
enum class ChorusButtonFlavor { Standard, Destructive }

/** Inline minimum width keeps adjacent buttons aligned in dialog / form rows. */
private val StandaloneMinWidth: Dp = 160.dp

@Composable
fun ChorusButton(
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    size: ChorusButtonSize = ChorusButtonSize.Large,
    appearance: ChorusButtonAppearance = ChorusButtonAppearance.Primary,
    flavor: ChorusButtonFlavor = ChorusButtonFlavor.Standard,
    leadingIcon: Painter? = null,
    fullWidth: Boolean = false,
    truncate: Boolean = false,
    enabled: Boolean = true,
) {
    val s = sizing(size)
    val surface = surfaceFor(appearance, flavor)

    SurfaceShell(
        surface = surface,
        radius = s.radius,
        minHeight = s.minHeight,
        paddingBlock = s.paddingBlock,
        paddingInline = s.paddingInline,
        onClick = onClick,
        enabled = enabled,
        modifier = modifier,
        minWidth = if (fullWidth) null else StandaloneMinWidth,
        fillMaxWidth = fullWidth,
    ) {
        Row(
            horizontalArrangement = Arrangement.spacedBy(s.gap, Alignment.CenterHorizontally),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            if (leadingIcon != null) {
                Image(
                    painter = leadingIcon,
                    contentDescription = null,
                    modifier = Modifier.size(s.iconSize),
                )
            }
            Text(
                text = label,
                style = s.labelTypo,
                color = surface.labelColor,
                maxLines = 1,
                overflow = if (truncate) TextOverflow.Ellipsis else TextOverflow.Clip,
            )
        }
    }
}

private data class Sizing(
    val paddingBlock: Dp,
    val paddingInline: Dp,
    val gap: Dp,
    val minHeight: Dp,
    val radius: Dp,
    val iconSize: Dp,
    val labelTypo: TextStyle,
)

private fun sizing(size: ChorusButtonSize): Sizing = when (size) {
    ChorusButtonSize.Large -> Sizing(
        paddingBlock = ChorusLayout.Container.xs,
        paddingInline = ChorusLayout.Container.md,
        gap = ChorusLayout.Inline.md,
        minHeight = 48.dp,
        radius = ChorusRadius.md,
        iconSize = ChorusIconSize.lg,
        labelTypo = ChorusTypography.Label.lg,
    )
    ChorusButtonSize.Medium -> Sizing(
        paddingBlock = ChorusLayout.Container.xs,
        paddingInline = ChorusLayout.Container.md,
        gap = ChorusLayout.Inline.md,
        minHeight = 40.dp,
        radius = ChorusRadius.md,
        iconSize = ChorusIconSize.md,
        labelTypo = ChorusTypography.Label.md,
    )
    ChorusButtonSize.Small -> Sizing(
        paddingBlock = ChorusLayout.Container.s2xs,
        paddingInline = ChorusLayout.Container.sm,
        gap = ChorusLayout.Inline.sm,
        minHeight = 32.dp,
        radius = ChorusRadius.sm,
        iconSize = ChorusIconSize.md,
        labelTypo = ChorusTypography.Label.md,
    )
}

@Composable
private fun surfaceFor(
    appearance: ChorusButtonAppearance,
    flavor: ChorusButtonFlavor,
): ChorusSurface {
    val c = ChorusTheme.colors
    return when (flavor) {
        ChorusButtonFlavor.Standard -> when (appearance) {
            ChorusButtonAppearance.Primary -> ChorusSurface(c.primary, c.onPrimary)
            ChorusButtonAppearance.Secondary -> ChorusSurface(c.secondaryContainer, c.onSecondaryContainer)
            ChorusButtonAppearance.Outlined -> ChorusSurface(
                Color.Transparent, c.primary, ChorusBorderWidth.hairline to c.primary,
            )
            ChorusButtonAppearance.Tertiary -> ChorusSurface(Color.Transparent, c.onSurfaceVariant)
        }
        ChorusButtonFlavor.Destructive -> when (appearance) {
            ChorusButtonAppearance.Primary -> ChorusSurface(c.error, c.onError)
            ChorusButtonAppearance.Secondary -> ChorusSurface(c.errorContainer, c.onErrorContainer)
            ChorusButtonAppearance.Outlined -> ChorusSurface(
                Color.Transparent, c.error, ChorusBorderWidth.hairline to c.error,
            )
            ChorusButtonAppearance.Tertiary -> ChorusSurface(Color.Transparent, c.error)
        }
    }
}
