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
                CatalogSection(title: "Primary") {
                    appearanceRow(appearance: .primary, flavor: .standard)
                }
                CatalogSection(title: "Secondary") {
                    appearanceRow(appearance: .secondary, flavor: .standard)
                }
                CatalogSection(title: "Outlined") {
                    appearanceRow(appearance: .outlined, flavor: .standard)
                }
                CatalogSection(title: "Tertiary") {
                    appearanceRow(appearance: .tertiary, flavor: .standard)
                }
                CatalogSection(title: "Destructive · primary") {
                    appearanceRow(appearance: .primary, flavor: .destructive)
                }
                CatalogSection(title: "Destructive · outlined") {
                    appearanceRow(appearance: .outlined, flavor: .destructive)
                }
                CatalogSection(title: "Disabled") {
                    HStack(spacing: ChorusLayout.Inline.md) {
                        ChorusButton("Primary", appearance: .primary, action: {})
                            .disabled(true)
                        ChorusButton("Outlined", appearance: .outlined, action: {})
                            .disabled(true)
                    }
                }
                CatalogSection(title: "With leading icon") {
                    HStack(spacing: ChorusLayout.Inline.md) {
                        ChorusButton("Save", leadingIcon: Image(systemName: "checkmark"), action: {})
                        ChorusButton("Delete",
                                     appearance: .outlined,
                                     flavor: .destructive,
                                     leadingIcon: Image(systemName: "trash"),
                                     action: {})
                    }
                }
                CatalogSection(title: "Full width") {
                    ChorusButton("Continue", fullWidth: true, action: {})
                }
            }
            .padding(ChorusLayout.Page.md)
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
