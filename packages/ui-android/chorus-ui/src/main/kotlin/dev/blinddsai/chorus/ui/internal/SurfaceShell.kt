package dev.blinddsai.chorus.ui.internal

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
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
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.Dp
import dev.blinddsai.chorus.tokens.generated.ChorusStateOpacity

/**
 * Background + label + optional outline that every Chorus pressable
 * surface resolves before rendering. The shell at [SurfaceShell] paints
 * this and overlays the pressed-state scrim per the spec's
 * foreground-over-base rule.
 */
internal data class ChorusSurface(
    val background: Color,
    val labelColor: Color,
    val border: Pair<Dp, Color>? = null,
)

/**
 * Shared scaffold for Button, Chip, and any future component whose
 * spec reduces to "rounded rectangle of [surface], optionally with an
 * outline, optionally pressable, optionally dimmed when disabled."
 *
 * [minWidth] is null for chips (no minimum) and set for buttons to
 * keep adjacent inline buttons aligned per the standard spec.
 */
@Composable
internal fun SurfaceShell(
    surface: ChorusSurface,
    radius: Dp,
    minHeight: Dp,
    paddingBlock: Dp,
    paddingInline: Dp,
    onClick: (() -> Unit)?,
    enabled: Boolean,
    modifier: Modifier = Modifier,
    minWidth: Dp? = null,
    fillMaxWidth: Boolean = false,
    content: @Composable () -> Unit,
) {
    val shape = remember(radius) { RoundedCornerShape(radius) }
    val borderStroke = surface.border?.let { (w, c) ->
        remember(w, c) { BorderStroke(w, c) }
    }
    val interactionSource = remember { MutableInteractionSource() }
    val pressed by interactionSource.collectIsPressedAsState()

    val widthModifier = when {
        fillMaxWidth -> Modifier.fillMaxWidth()
        minWidth != null -> Modifier.defaultMinSize(minWidth = minWidth)
        else -> Modifier
    }

    Box(
        modifier = modifier
            .then(widthModifier)
            .defaultMinSize(minHeight = minHeight)
            .alpha(if (enabled) 1f else ChorusStateOpacity.disabled)
            .clip(shape)
            .background(surface.background, shape)
            .then(borderStroke?.let { Modifier.border(it, shape) } ?: Modifier)
            .then(
                if (onClick != null) {
                    Modifier.clickable(
                        interactionSource = interactionSource,
                        indication = rememberRipple(color = surface.labelColor),
                        enabled = enabled,
                        role = Role.Button,
                        onClick = onClick,
                    )
                } else Modifier
            )
            .padding(PaddingValues(horizontal = paddingInline, vertical = paddingBlock)),
        contentAlignment = Alignment.Center,
    ) {
        if (pressed) {
            Box(
                Modifier
                    .matchParentSize()
                    .background(surface.labelColor.copy(alpha = ChorusStateOpacity.pressed))
            )
        }
        content()
    }
}
