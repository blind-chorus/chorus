package dev.blinddsai.chorus.ui.catalog

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import dev.blinddsai.chorus.tokens.ChorusTheme
import dev.blinddsai.chorus.tokens.generated.ChorusLayout
import dev.blinddsai.chorus.ui.chip.ChorusFilterChip
import dev.blinddsai.chorus.ui.chip.ChorusTagChip

@Composable
fun ChorusChipCatalog() {
    var sort by remember { mutableStateOf(true) }
    var date by remember { mutableStateOf(false) }
    var location by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(ChorusLayout.Page.md),
        verticalArrangement = Arrangement.spacedBy(ChorusLayout.Stack.lg),
    ) {
        CatalogSection("Filter · selected + unselected") {
            Row(horizontalArrangement = Arrangement.spacedBy(ChorusLayout.Inline.sm)) {
                ChorusFilterChip("Sort", selected = sort, onClick = { sort = !sort })
                ChorusFilterChip("Date", selected = date, onClick = { date = !date })
                ChorusFilterChip("Location", selected = location, onClick = { location = !location })
            }
        }
        CatalogSection("Tag · passive") {
            Row(horizontalArrangement = Arrangement.spacedBy(ChorusLayout.Inline.sm)) {
                ChorusTagChip("New")
                ChorusTagChip("Beta")
                ChorusTagChip("Internal")
            }
        }
        CatalogSection("Tag · dismissable") {
            Row(horizontalArrangement = Arrangement.spacedBy(ChorusLayout.Inline.sm)) {
                ChorusTagChip("design", onDismiss = {})
                ChorusTagChip("ios", onDismiss = {})
            }
        }
        CatalogSection("Disabled") {
            Row(horizontalArrangement = Arrangement.spacedBy(ChorusLayout.Inline.sm)) {
                ChorusFilterChip("Sort", selected = false, onClick = {}, enabled = false)
                ChorusFilterChip("Date", selected = true, onClick = {}, enabled = false)
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
private fun PreviewLight() {
    ChorusTheme(darkTheme = false) { ChorusChipCatalog() }
}

@Preview(showBackground = true)
@Composable
private fun PreviewDark() {
    ChorusTheme(darkTheme = true) { ChorusChipCatalog() }
}
