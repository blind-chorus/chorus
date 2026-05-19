import SwiftUI
import ChorusUI
import ChorusTokens

/// Catalog screen matching the docs site's Button stage. Each row is a
/// (flavor × appearance) cell exposed at all three sizes plus a disabled
/// + leadingIcon variant. Drop this into a SwiftUI preview or wire it
/// into your sample app's navigation to confirm visual parity with
/// `apps/docs/components/standard.md`.
public struct ChorusButtonCatalog: View {
    public init() {}

    public var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: ChorusLayout.Stack.lg) {
                section("Primary") {
                    appearanceRow(appearance: .primary, flavor: .standard)
                }
                section("Secondary") {
                    appearanceRow(appearance: .secondary, flavor: .standard)
                }
                section("Outlined") {
                    appearanceRow(appearance: .outlined, flavor: .standard)
                }
                section("Tertiary") {
                    appearanceRow(appearance: .tertiary, flavor: .standard)
                }
                section("Destructive · primary") {
                    appearanceRow(appearance: .primary, flavor: .destructive)
                }
                section("Destructive · outlined") {
                    appearanceRow(appearance: .outlined, flavor: .destructive)
                }
                section("Disabled") {
                    HStack(spacing: ChorusLayout.Inline.md) {
                        ChorusButton("Primary", appearance: .primary, action: {})
                            .disabled(true)
                        ChorusButton("Outlined", appearance: .outlined, action: {})
                            .disabled(true)
                    }
                }
                section("With leading icon") {
                    HStack(spacing: ChorusLayout.Inline.md) {
                        ChorusButton("Save", leadingIcon: Image(systemName: "checkmark"), action: {})
                        ChorusButton("Delete",
                                     appearance: .outlined,
                                     flavor: .destructive,
                                     leadingIcon: Image(systemName: "trash"),
                                     action: {})
                    }
                }
                section("Full width") {
                    ChorusButton("Continue", fullWidth: true, action: {})
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

    private func appearanceRow(
        appearance: ChorusButton.Appearance,
        flavor: ChorusButton.Flavor
    ) -> some View {
        HStack(alignment: .center, spacing: ChorusLayout.Inline.md) {
            ChorusButton("Large", size: .large, appearance: appearance, flavor: flavor, action: {})
            ChorusButton("Medium", size: .medium, appearance: appearance, flavor: flavor, action: {})
            ChorusButton("Small", size: .small, appearance: appearance, flavor: flavor, action: {})
        }
    }
}

#if DEBUG
struct ChorusButtonCatalog_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            ChorusButtonCatalog().preferredColorScheme(.light)
            ChorusButtonCatalog().preferredColorScheme(.dark)
        }
    }
}
#endif
