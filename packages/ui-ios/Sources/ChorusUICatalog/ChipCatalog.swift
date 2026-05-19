import SwiftUI
import ChorusUI
import ChorusTokens

public struct ChorusChipCatalog: View {
    @State private var sortSelected = true
    @State private var dateSelected = false
    @State private var locationSelected = false

    public init() {}

    public var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: ChorusLayout.Stack.lg) {
                section("Filter · selected + unselected") {
                    HStack(spacing: ChorusLayout.Inline.sm) {
                        ChorusChip.filter("Sort", selected: sortSelected) { sortSelected.toggle() }
                        ChorusChip.filter("Date", selected: dateSelected) { dateSelected.toggle() }
                        ChorusChip.filter("Location", selected: locationSelected) { locationSelected.toggle() }
                    }
                }
                section("Filter · with leading icon") {
                    HStack(spacing: ChorusLayout.Inline.sm) {
                        ChorusChip.filter("Starred",
                                          selected: true,
                                          leadingIcon: Image(systemName: "star.fill")) {}
                        ChorusChip.filter("Recent",
                                          selected: false,
                                          leadingIcon: Image(systemName: "clock")) {}
                    }
                }
                section("Tag · passive") {
                    HStack(spacing: ChorusLayout.Inline.sm) {
                        ChorusChip.tag("New")
                        ChorusChip.tag("Beta")
                        ChorusChip.tag("Internal")
                    }
                }
                section("Tag · dismissable") {
                    HStack(spacing: ChorusLayout.Inline.sm) {
                        ChorusChip.tag("design", onDismiss: {})
                        ChorusChip.tag("ios", onDismiss: {})
                    }
                }
                section("Disabled") {
                    HStack(spacing: ChorusLayout.Inline.sm) {
                        ChorusChip.filter("Sort", selected: false) {}.disabled(true)
                        ChorusChip.filter("Date", selected: true) {}.disabled(true)
                    }
                }
            }
            .padding(ChorusLayout.Page.md)
        }
    }

    @ViewBuilder
    private func section<Content: View>(_ title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: ChorusLayout.Stack.sm) {
            Text(title)
                .font(.system(size: ChorusTypography.Label.sm.size, weight: ChorusTypography.Label.sm.fontWeight))
                .foregroundStyle(.secondary)
            content()
        }
    }
}

#if DEBUG
struct ChorusChipCatalog_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            ChorusChipCatalog().preferredColorScheme(.light)
            ChorusChipCatalog().preferredColorScheme(.dark)
        }
    }
}
#endif
