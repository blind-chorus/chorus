package dev.blinddsai.chorus.ui.catalog

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import dev.blinddsai.chorus.tokens.ChorusTheme
import dev.blinddsai.chorus.tokens.generated.ChorusLayout
import dev.blinddsai.chorus.tokens.generated.ChorusTypography
import dev.blinddsai.chorus.ui.button.ChorusButton
import dev.blinddsai.chorus.ui.button.ChorusButtonAppearance
import dev.blinddsai.chorus.ui.button.ChorusButtonFlavor
import dev.blinddsai.chorus.ui.button.ChorusButtonSize

/**
 * Catalog screen mirroring the docs site Button stage. Each section is a
 * (flavor × appearance) cell shown at all three sizes; trailing sections
 * cover disabled, leading-icon, and fullWidth states. Drop into a sample
 * app or preview to validate visual parity.
 */
@Composable
fun ChorusButtonCatalog() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(ChorusLayout.Page.md),
        verticalArrangement = Arrangement.spacedBy(ChorusLayout.Stack.lg),
    ) {
        Section("Primary") { Row3(ChorusButtonAppearance.Primary, ChorusButtonFlavor.Standard) }
        Section("Secondary") { Row3(ChorusButtonAppearance.Secondary, ChorusButtonFlavor.Standard) }
        Section("Outlined") { Row3(ChorusButtonAppearance.Outlined, ChorusButtonFlavor.Standard) }
        Section("Tertiary") { Row3(ChorusButtonAppearance.Tertiary, ChorusButtonFlavor.Standard) }
        Section("Destructive · primary") { Row3(ChorusButtonAppearance.Primary, ChorusButtonFlavor.Destructive) }
        Section("Destructive · outlined") { Row3(ChorusButtonAppearance.Outlined, ChorusButtonFlavor.Destructive) }
        Section("Disabled") {
            Row(horizontalArrangement = Arrangement.spacedBy(ChorusLayout.Inline.md)) {
                ChorusButton("Primary", onClick = {}, enabled = false)
                ChorusButton("Outlined", onClick = {}, appearance = ChorusButtonAppearance.Outlined, enabled = false)
            }
        }
        Section("Full width") {
            ChorusButton("Continue", onClick = {}, fullWidth = true)
        }
    }
}

@Composable
private fun Section(title: String, content: @Composable () -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(ChorusLayout.Stack.sm)) {
        Text(title, style = ChorusTypography.Label.sm, color = ChorusTheme.colors.onSurfaceVariant)
        content()
    }
}

@Composable
private fun Row3(appearance: ChorusButtonAppearance, flavor: ChorusButtonFlavor) {
    Row(horizontalArrangement = Arrangement.spacedBy(ChorusLayout.Inline.md)) {
        ChorusButton("Large", onClick = {}, size = ChorusButtonSize.Large, appearance = appearance, flavor = flavor)
        ChorusButton("Medium", onClick = {}, size = ChorusButtonSize.Medium, appearance = appearance, flavor = flavor)
        ChorusButton("Small", onClick = {}, size = ChorusButtonSize.Small, appearance = appearance, flavor = flavor)
    }
}

@Preview(showBackground = true)
@Composable
private fun PreviewLight() {
    ChorusTheme(darkTheme = false) { ChorusButtonCatalog() }
}

@Preview(showBackground = true)
@Composable
private fun PreviewDark() {
    ChorusTheme(darkTheme = true) { ChorusButtonCatalog() }
}
