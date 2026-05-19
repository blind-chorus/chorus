package dev.blinddsai.chorus.ui.button

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.ripple.rememberRipple
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.foundation.Image
import androidx.compose.material.Text
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import dev.blinddsai.chorus.tokens.ChorusTheme
import dev.blinddsai.chorus.tokens.generated.ChorusBorderWidth
import dev.blinddsai.chorus.tokens.generated.ChorusIconSize
import dev.blinddsai.chorus.tokens.generated.ChorusLayout
import dev.blinddsai.chorus.tokens.generated.ChorusRadius
import dev.blinddsai.chorus.tokens.generated.ChorusStateOpacity
import dev.blinddsai.chorus.tokens.generated.ChorusTypography

/**
 * Compose port of the Chorus standard Button.
 *
 * Spec of record: `schema/components/button/standard.spec.json`. Two
 * independent axes — [size] (chosen by surface) and [appearance] (chosen
 * by emphasis) — plus the [flavor] axis ([Flavor.Destructive] swaps the
 * primary family for the error family). Pointer-state overlays
 * (pressed) compose foreground-over-base per the spec's "Compose state
 * as foreground-over-base" rule; disabled lowers the container opacity
 * instead.
 */
enum class ChorusButtonSize { Large, Medium, Small }
enum class ChorusButtonAppearance { Primary, Secondary, Outlined, Tertiary }
enum class ChorusButtonFlavor { Standard, Destructive }

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

    val interactionSource = remember { MutableInteractionSource() }
    val pressed by interactionSource.collectIsPressedAsState()

    val shape = RoundedCornerShape(s.radius)

    Box(
        modifier = modifier
            .then(if (fullWidth) Modifier.fillMaxWidth() else Modifier.widthIn(min = 160.dp))
            .defaultMinSize(minHeight = s.minHeight)
            .alpha(if (enabled) 1f else ChorusStateOpacity.disabled)
            .clip(shape)
            .background(surface.background, shape)
            .then(
                surface.border?.let { (w, c) ->
                    Modifier.border(BorderStroke(w, c), shape)
                } ?: Modifier
            )
            .clickable(
                interactionSource = interactionSource,
                indication = rememberRipple(color = surface.label),
                enabled = enabled,
                role = Role.Button,
                onClick = onClick,
            )
            .padding(PaddingValues(horizontal = s.paddingInline, vertical = s.paddingBlock)),
        contentAlignment = Alignment.Center,
    ) {
        // Pressed overlay — foreground-color tinted scrim on top of base.
        if (pressed) {
            Box(
                modifier = Modifier
                    .matchParentSize()
                    .background(surface.label.copy(alpha = ChorusStateOpacity.pressed))
            )
        }

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
                color = surface.label,
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
        minHeight = 48.dp, // ref.space.600
        radius = ChorusRadius.md,
        iconSize = ChorusIconSize.lg,
        labelTypo = ChorusTypography.Label.lg,
    )
    ChorusButtonSize.Medium -> Sizing(
        paddingBlock = ChorusLayout.Container.xs,
        paddingInline = ChorusLayout.Container.md,
        gap = ChorusLayout.Inline.md,
        minHeight = 40.dp, // ref.space.500
        radius = ChorusRadius.md,
        iconSize = ChorusIconSize.md,
        labelTypo = ChorusTypography.Label.md,
    )
    ChorusButtonSize.Small -> Sizing(
        paddingBlock = ChorusLayout.Container.s2xs,
        paddingInline = ChorusLayout.Container.sm,
        gap = ChorusLayout.Inline.sm,
        minHeight = 32.dp, // ref.space.400
        radius = ChorusRadius.sm,
        iconSize = ChorusIconSize.md,
        labelTypo = ChorusTypography.Label.md,
    )
}

private data class Surface(
    val background: Color,
    val label: Color,
    val border: Pair<Dp, Color>?,
)

@Composable
private fun surfaceFor(
    appearance: ChorusButtonAppearance,
    flavor: ChorusButtonFlavor,
): Surface {
    val c = ChorusTheme.colors
    return when (flavor to appearance) {
        ChorusButtonFlavor.Standard to ChorusButtonAppearance.Primary ->
            Surface(c.primary, c.onPrimary, null)
        ChorusButtonFlavor.Standard to ChorusButtonAppearance.Secondary ->
            Surface(c.secondaryContainer, c.onSecondaryContainer, null)
        ChorusButtonFlavor.Standard to ChorusButtonAppearance.Outlined ->
            Surface(Color.Transparent, c.primary, ChorusBorderWidth.hairline to c.primary)
        ChorusButtonFlavor.Standard to ChorusButtonAppearance.Tertiary ->
            Surface(Color.Transparent, c.onSurfaceVariant, null)
        ChorusButtonFlavor.Destructive to ChorusButtonAppearance.Primary ->
            Surface(c.error, c.onError, null)
        ChorusButtonFlavor.Destructive to ChorusButtonAppearance.Secondary ->
            Surface(c.errorContainer, c.onErrorContainer, null)
        ChorusButtonFlavor.Destructive to ChorusButtonAppearance.Outlined ->
            Surface(Color.Transparent, c.error, ChorusBorderWidth.hairline to c.error)
        ChorusButtonFlavor.Destructive to ChorusButtonAppearance.Tertiary ->
            Surface(Color.Transparent, c.error, null)
        else -> error("unreachable")
    }
}
