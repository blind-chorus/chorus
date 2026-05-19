package dev.blinddsai.chorus.ui.chip

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Text
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
import androidx.compose.foundation.Image
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import dev.blinddsai.chorus.tokens.ChorusTheme
import dev.blinddsai.chorus.tokens.generated.ChorusBorderWidth
import dev.blinddsai.chorus.tokens.generated.ChorusIconSize
import dev.blinddsai.chorus.tokens.generated.ChorusLayout
import dev.blinddsai.chorus.tokens.generated.ChorusPalette
import dev.blinddsai.chorus.tokens.generated.ChorusRadius
import dev.blinddsai.chorus.tokens.generated.ChorusStateOpacity
import dev.blinddsai.chorus.tokens.generated.ChorusTypography

/**
 * Compose port of the Chorus Chip family.
 *
 *  - [ChorusFilterChip] — selectable capsule; transparent + hairline
 *    when unselected, inverse-surface fill when selected.
 *  - [ChorusTagChip] — passive (or dismissable via `onDismiss`)
 *    metadata label with a translucent neutral background that adapts
 *    to whatever surface sits behind.
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
    val background = if (selected) c.inverseSurface else Color.Transparent
    val labelColor = if (selected) c.inverseOnSurface else c.onSurface
    val border: Pair<Dp, Color>? =
        if (selected) null else ChorusBorderWidth.hairline to c.outlineVariant

    ChipShell(
        radius = ChorusRadius.full,
        minHeight = 32.dp, // ref.space.400
        paddingBlock = ChorusLayout.Container.s2xs,
        paddingInline = ChorusLayout.Container.sm,
        labelInset = ChorusLayout.Container.s2xs,
        background = background,
        labelColor = labelColor,
        border = border,
        onClick = onClick,
        enabled = enabled,
        modifier = modifier,
    ) {
        if (leadingIcon != null) {
            Image(painter = leadingIcon, contentDescription = null,
                  modifier = Modifier.size(ChorusIconSize.md))
        }
        Text(label, style = ChorusTypography.Label.sm, color = labelColor, maxLines = 1)
        if (trailingIcon != null) {
            Image(painter = trailingIcon, contentDescription = null,
                  modifier = Modifier.size(ChorusIconSize.md))
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
    val dark = isSystemInDarkTheme()
    val background = if (dark) ChorusPalette.White.s200 else ChorusPalette.Black.s200

    ChipShell(
        radius = ChorusRadius.sm,
        minHeight = 24.dp, // ref.space.300
        paddingBlock = ChorusLayout.Container.s2xs,
        paddingInline = ChorusLayout.Container.xs,
        labelInset = ChorusLayout.Container.s2xs,
        background = background,
        labelColor = c.onSurface,
        border = null,
        onClick = onDismiss,
        enabled = enabled,
        modifier = modifier,
    ) {
        Text(label, style = ChorusTypography.Label.sm, color = c.onSurface, maxLines = 1)
        if (trailingIcon != null) {
            Image(painter = trailingIcon, contentDescription = null,
                  modifier = Modifier.size(ChorusIconSize.md))
        }
    }
}

@Composable
private fun ChipShell(
    radius: Dp,
    minHeight: Dp,
    paddingBlock: Dp,
    paddingInline: Dp,
    labelInset: Dp,
    background: Color,
    labelColor: Color,
    border: Pair<Dp, Color>?,
    onClick: (() -> Unit)?,
    enabled: Boolean,
    modifier: Modifier,
    content: @Composable () -> Unit,
) {
    val shape = RoundedCornerShape(radius)
    val interactionSource = remember { MutableInteractionSource() }
    val pressed by interactionSource.collectIsPressedAsState()

    val clickModifier = if (onClick != null) {
        Modifier.clickable(
            interactionSource = interactionSource,
            indication = rememberRipple(color = labelColor),
            enabled = enabled,
            role = Role.Button,
            onClick = onClick,
        )
    } else Modifier

    Box(
        modifier = modifier
            .defaultMinSize(minHeight = minHeight)
            .alpha(if (enabled) 1f else ChorusStateOpacity.disabled)
            .clip(shape)
            .background(background, shape)
            .then(border?.let { (w, c) -> Modifier.border(BorderStroke(w, c), shape) } ?: Modifier)
            .then(clickModifier)
            .padding(PaddingValues(horizontal = paddingInline, vertical = paddingBlock)),
        contentAlignment = Alignment.Center,
    ) {
        if (pressed && onClick != null) {
            Box(
                modifier = Modifier
                    .matchParentSize()
                    .background(labelColor.copy(alpha = ChorusStateOpacity.pressed))
            )
        }
        Row(
            horizontalArrangement = Arrangement.spacedBy(labelInset, Alignment.CenterHorizontally),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            content()
        }
    }
}
