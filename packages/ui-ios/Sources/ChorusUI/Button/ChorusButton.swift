import SwiftUI
import ChorusTokens

/// SwiftUI port of the Chorus standard Button.
/// Spec: `schema/components/button/standard.spec.json`.
public struct ChorusButton: View {
    public enum Size { case large, medium, small }
    public enum Appearance { case primary, secondary, outlined, tertiary }
    public enum Flavor { case standard, destructive }

    private let label: String
    private let size: Size
    private let appearance: Appearance
    private let flavor: Flavor
    private let leadingIcon: Image?
    private let fullWidth: Bool
    private let truncate: Bool
    private let action: () -> Void

    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.isEnabled) private var isEnabled

    public init(
        _ label: String,
        size: Size = .large,
        appearance: Appearance = .primary,
        flavor: Flavor = .standard,
        leadingIcon: Image? = nil,
        fullWidth: Bool = false,
        truncate: Bool = false,
        action: @escaping () -> Void
    ) {
        self.label = label
        self.size = size
        self.appearance = appearance
        self.flavor = flavor
        self.leadingIcon = leadingIcon
        self.fullWidth = fullWidth
        self.truncate = truncate
        self.action = action
    }

    public var body: some View {
        let s = sizing(size)
        let surface = surface(for: ChorusColors.themed(for: colorScheme))

        Button(action: action) {
            HStack(spacing: s.gap) {
                if let icon = leadingIcon {
                    icon
                        .resizable()
                        .renderingMode(.template)
                        .frame(width: s.iconSize, height: s.iconSize)
                }
                Text(label)
                    .lineLimit(1)
                    .fixedSize(horizontal: !truncate && !fullWidth, vertical: false)
            }
            .frame(maxWidth: fullWidth ? .infinity : nil, minHeight: s.minHeight)
            .frame(minWidth: fullWidth ? nil : Self.standaloneMinWidth)
            .padding(.vertical, s.paddingBlock)
            .padding(.horizontal, s.paddingInline)
        }
        .buttonStyle(ChorusSurfaceButtonStyle(surface: surface, radius: s.radius))
        .font(.system(size: s.labelTypo.size, weight: s.labelTypo.fontWeight))
        .tracking(s.labelTypo.trackingPoints)
        .opacity(isEnabled ? 1.0 : ChorusStateOpacity.disabled)
    }

    /// Inline buttons reserve a 160pt minimum width so adjacent buttons
    /// line up in dialog / form rows where labels vary in length. Spec
    /// calls out `minWidth: 160px` per size.
    private static let standaloneMinWidth: CGFloat = 160

    private struct Sizing {
        let paddingBlock: CGFloat
        let paddingInline: CGFloat
        let gap: CGFloat
        let minHeight: CGFloat
        let radius: CGFloat
        let iconSize: CGFloat
        let labelTypo: ChorusTextStyle
    }

    private func sizing(_ size: Size) -> Sizing {
        switch size {
        case .large:
            return Sizing(
                paddingBlock: ChorusLayout.Container.xs,
                paddingInline: ChorusLayout.Container.md,
                gap: ChorusLayout.Inline.md,
                minHeight: 48,
                radius: ChorusRadius.md,
                iconSize: ChorusIconSize.lg,
                labelTypo: ChorusTypography.Label.lg
            )
        case .medium:
            return Sizing(
                paddingBlock: ChorusLayout.Container.xs,
                paddingInline: ChorusLayout.Container.md,
                gap: ChorusLayout.Inline.md,
                minHeight: 40,
                radius: ChorusRadius.md,
                iconSize: ChorusIconSize.md,
                labelTypo: ChorusTypography.Label.md
            )
        case .small:
            return Sizing(
                paddingBlock: ChorusLayout.Container.s2xs,
                paddingInline: ChorusLayout.Container.sm,
                gap: ChorusLayout.Inline.sm,
                minHeight: 32,
                radius: ChorusRadius.sm,
                iconSize: ChorusIconSize.md,
                labelTypo: ChorusTypography.Label.md
            )
        }
    }

    private func surface(for palette: ChorusThemedColors) -> ChorusSurface {
        switch (flavor, appearance) {
        case (.standard, .primary):
            return ChorusSurface(background: palette.primary, label: palette.onPrimary, border: nil)
        case (.standard, .secondary):
            return ChorusSurface(background: palette.secondaryContainer, label: palette.onSecondaryContainer, border: nil)
        case (.standard, .outlined):
            return ChorusSurface(background: .clear, label: palette.primary, border: (ChorusBorderWidth.hairline, palette.primary))
        case (.standard, .tertiary):
            return ChorusSurface(background: .clear, label: palette.onSurfaceVariant, border: nil)
        case (.destructive, .primary):
            return ChorusSurface(background: palette.error, label: palette.onError, border: nil)
        case (.destructive, .secondary):
            return ChorusSurface(background: palette.errorContainer, label: palette.onErrorContainer, border: nil)
        case (.destructive, .outlined):
            return ChorusSurface(background: .clear, label: palette.error, border: (ChorusBorderWidth.hairline, palette.error))
        case (.destructive, .tertiary):
            return ChorusSurface(background: .clear, label: palette.error, border: nil)
        }
    }
}
