package dev.blinddsai.chorus.ui.catalog

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import dev.blinddsai.chorus.tokens.ChorusTheme
import dev.blinddsai.chorus.tokens.generated.ChorusLayout
import dev.blinddsai.chorus.tokens.generated.ChorusTypography

/** Labelled vertical group used by every catalog screen. */
@Composable
internal fun CatalogSection(title: String, content: @Composable () -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(ChorusLayout.Stack.sm)) {
        Text(title, style = ChorusTypography.Label.sm, color = ChorusTheme.colors.onSurfaceVariant)
        content()
    }
}
