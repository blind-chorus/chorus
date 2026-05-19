import SwiftUI
import ChorusTokens

/// SwiftUI port of the Chorus standard Button.
///
/// Spec of record: `schema/components/button/standard.spec.json`.
/// Two independent axes — `size` (chosen by surface) and `appearance`
/// (chosen by emphasis) — plus a `destructive` flavor that swaps the
/// primary family for the error family. Pointer-state overlays
/// (hover / pressed / focused) are composed as a foreground-over-base
/// label-colored layer per the spec's "Compose state as foreground-over-base"
/// rule. Disabled is the only state that lowers container opacity rather
/// than overlaying.

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
        let palette = ChorusColors.themed(for: colorScheme)
        let surface = surfaceFor(palette: palette)

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
                    .truncationMode(truncate ? .tail : .tail)
                    .fixedSize(horizontal: !truncate && !fullWidth, vertical: false)
            }
            .frame(maxWidth: fullWidth ? .infinity : nil, minHeight: s.minHeight)
            .frame(minWidth: fullWidth ? nil : 160)
            .padding(.vertical, s.paddingBlock)
            .padding(.horizontal, s.paddingInline)
        }
        .buttonStyle(ChorusButtonStyle(surface: surface, radius: s.radius, label: s.label))
        .font(.system(size: s.labelTypo.size, weight: s.labelTypo.fontWeight))
        .tracking(s.labelTypo.trackingPoints)
        .opacity(isEnabled ? 1.0 : ChorusStateOpacity.disabled)
    }

    // MARK: - Sizing -------------------------------------------------------
    private struct Sizing {
        let paddingBlock: CGFloat
        let paddingInline: CGFloat
        let gap: CGFloat
        let minHeight: CGFloat
        let radius: CGFloat
        let labelTypo: ChorusTextStyle
        let iconSize: CGFloat
        let label: ChorusTextStyle
    }

    private func sizing(_ size: Size) -> Sizing {
        switch size {
        case .large:
            return Sizing(
                paddingBlock: ChorusLayout.Container.xs,
                paddingInline: ChorusLayout.Container.md,
                gap: ChorusLayout.Inline.md,
                minHeight: 48, // ref.space.600
                radius: ChorusRadius.md,
                labelTypo: ChorusTypography.Label.lg,
                iconSize: ChorusIconSize.lg,
                label: ChorusTypography.Label.lg
            )
        case .medium:
            return Sizing(
                paddingBlock: ChorusLayout.Container.xs,
                paddingInline: ChorusLayout.Container.md,
                gap: ChorusLayout.Inline.md,
                minHeight: 40, // ref.space.500
                radius: ChorusRadius.md,
                labelTypo: ChorusTypography.Label.md,
                iconSize: ChorusIconSize.md,
                label: ChorusTypography.Label.md
            )
        case .small:
            return Sizing(
                paddingBlock: ChorusLayout.Container.s2xs,
                paddingInline: ChorusLayout.Container.sm,
                gap: ChorusLayout.Inline.sm,
                minHeight: 32, // ref.space.400
                radius: ChorusRadius.sm,
                labelTypo: ChorusTypography.Label.md,
                iconSize: ChorusIconSize.md,
                label: ChorusTypography.Label.md
            )
        }
    }

    // MARK: - Appearance ---------------------------------------------------
    struct Surface {
        let background: Color
        let label: Color
        let border: (width: CGFloat, color: Color)?
    }

    private func surfaceFor(palette: ChorusThemedColors) -> Surface {
        switch (flavor, appearance) {
        case (.standard, .primary):
            return Surface(background: palette.primary, label: palette.onPrimary, border: nil)
        case (.standard, .secondary):
            return Surface(background: palette.secondaryContainer, label: palette.onSecondaryContainer, border: nil)
        case (.standard, .outlined):
            return Surface(background: .clear, label: palette.primary, border: (ChorusBorderWidth.hairline, palette.primary))
        case (.standard, .tertiary):
            return Surface(background: .clear, label: palette.onSurfaceVariant, border: nil)
        case (.destructive, .primary):
            return Surface(background: palette.error, label: palette.onError, border: nil)
        case (.destructive, .secondary):
            return Surface(background: palette.errorContainer, label: palette.onErrorContainer, border: nil)
        case (.destructive, .outlined):
            return Surface(background: .clear, label: palette.error, border: (ChorusBorderWidth.hairline, palette.error))
        case (.destructive, .tertiary):
            return Surface(background: .clear, label: palette.error, border: nil)
        }
    }
}

// MARK: - ButtonStyle ------------------------------------------------------

/// Renders the background, border, label color, and pointer-state overlays.
/// Disabled-state container dim is applied by the parent view's `.opacity`
/// modifier so this style only handles pressed (and would handle hovered
/// on macOS if needed).
private struct ChorusButtonStyle: ButtonStyle {
    let surface: ChorusButton.Surface
    let radius: CGFloat
    let label: ChorusTextStyle

    func makeBody(configuration: Configuration) -> some View {
        ZStack {
            // Base background.
            RoundedRectangle(cornerRadius: radius, style: .continuous)
                .fill(surface.background)

            // Foreground-over-base state overlay (pressed).
            if configuration.isPressed {
                RoundedRectangle(cornerRadius: radius, style: .continuous)
                    .fill(surface.label.opacity(ChorusStateOpacity.pressed))
            }

            // Outline.
            if let border = surface.border {
                RoundedRectangle(cornerRadius: radius, style: .continuous)
                    .strokeBorder(border.color, lineWidth: border.width)
            }

            configuration.label
                .foregroundStyle(surface.label)
        }
        .compositingGroup()
    }
}
