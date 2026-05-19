import SwiftUI
import ChorusTokens

/// Labelled vertical group used by every catalog screen. Title sits at
/// the role's `Label.sm` token, content below at the stack-md gap.
struct CatalogSection<Content: View>: View {
    let title: String
    @ViewBuilder var content: () -> Content

    var body: some View {
        VStack(alignment: .leading, spacing: ChorusLayout.Stack.sm) {
            Text(title)
                .font(.system(size: ChorusTypography.Label.sm.size,
                              weight: ChorusTypography.Label.sm.fontWeight))
                .foregroundStyle(.secondary)
            content()
        }
    }
}
