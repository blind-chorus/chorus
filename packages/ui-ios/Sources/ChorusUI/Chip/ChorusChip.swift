import SwiftUI
import ChorusTokens

/// SwiftUI port of the Chorus Chip family.
///
/// Spec of record:
///  - `schema/components/chip/filter.spec.json` (selectable capsule)
///  - `schema/components/chip/tag.spec.json` (passive metadata)
///
/// Filter chips toggle between transparent + hairline (unselected) and
/// inverse-surface fill (selected). Tag chips carry a translucent
/// neutral overlay (black.200 in light, white.200 in dark) so they
/// adopt whatever surface sits behind them.

public enum ChorusChipVariant { case filter, tag }

public struct ChorusChip: View {
    private let label: String
    private let variant: ChorusChipVariant
    private let selected: Bool
    private let leadingIcon: Image?
    private let trailingIcon: Image?
    private let action: (() -> Void)?

    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.isEnabled) private var isEnabled

    /// Filter chip — selectable.
    public static func filter(
        _ label: String,
        selected: Bool,
        leadingIcon: Image? = nil,
        trailingIcon: Image? = nil,
        action: @escaping () -> Void
    ) -> ChorusChip {
        ChorusChip(
            label: label,
            variant: .filter,
            selected: selected,
            leadingIcon: leadingIcon,
            trailingIcon: trailingIcon,
            action: action
        )
    }

    /// Tag chip — passive (omit `onDismiss`) or interactive (dismissable
    /// via the trailing × glyph; pass `onDismiss`).
    public static func tag(
        _ label: String,
        onDismiss: (() -> Void)? = nil
    ) -> ChorusChip {
        ChorusChip(
            label: label,
            variant: .tag,
            selected: false,
            leadingIcon: nil,
            trailingIcon: onDismiss != nil ? Image(systemName: "xmark") : nil,
            action: onDismiss
        )
    }

    private init(
        label: String,
        variant: ChorusChipVariant,
        selected: Bool,
        leadingIcon: Image?,
        trailingIcon: Image?,
        action: (() -> Void)?
    ) {
        self.label = label
        self.variant = variant
        self.selected = selected
        self.leadingIcon = leadingIcon
        self.trailingIcon = trailingIcon
        self.action = action
    }

    public var body: some View {
        let s = sizing()
        let surface = surface()

        let content = HStack(spacing: 0) {
            if let icon = leadingIcon {
                icon
                    .resizable()
                    .renderingMode(.template)
                    .frame(width: s.iconSize, height: s.iconSize)
            }
            Text(label)
                .lineLimit(1)
                .padding(.horizontal, s.labelInset)
            if let icon = trailingIcon {
                icon
                    .resizable()
                    .renderingMode(.template)
                    .frame(width: s.iconSize, height: s.iconSize)
            }
        }
        .frame(minHeight: s.minHeight)
        .padding(.vertical, s.paddingBlock)
        .padding(.horizontal, s.paddingInline)

        Group {
            if let action {
                Button(action: action) { content }
                    .buttonStyle(ChipButtonStyle(surface: surface, radius: s.radius))
            } else {
                content
                    .background(surface.background)
                    .clipShape(RoundedRectangle(cornerRadius: s.radius, style: .continuous))
                    .foregroundStyle(surface.label)
            }
        }
        .font(.system(size: s.labelTypo.size, weight: s.labelTypo.fontWeight))
        .tracking(s.labelTypo.trackingPoints)
        .opacity(isEnabled ? 1.0 : ChorusStateOpacity.disabled)
    }

    // MARK: - Sizing
    private struct Sizing {
        let paddingBlock: CGFloat
        let paddingInline: CGFloat
        let labelInset: CGFloat
        let minHeight: CGFloat
        let radius: CGFloat
        let iconSize: CGFloat
        let labelTypo: ChorusTextStyle
    }

    private func sizing() -> Sizing {
        switch variant {
        case .filter:
            return Sizing(
                paddingBlock: ChorusLayout.Container.s2xs,
                paddingInline: ChorusLayout.Container.sm,
                labelInset: ChorusLayout.Container.s2xs,
                minHeight: 32, // ref.space.400
                radius: ChorusRadius.full,
                iconSize: ChorusIconSize.md,
                labelTypo: ChorusTypography.Label.sm
            )
        case .tag:
            return Sizing(
                paddingBlock: ChorusLayout.Container.s2xs,
                paddingInline: ChorusLayout.Container.xs,
                labelInset: ChorusLayout.Container.s2xs,
                minHeight: 24, // ref.space.300
                radius: ChorusRadius.sm,
                iconSize: ChorusIconSize.md,
                labelTypo: ChorusTypography.Label.sm
            )
        }
    }

    // MARK: - Surface
    struct Surface {
        let background: Color
        let label: Color
        let border: (width: CGFloat, color: Color)?
    }

    private func surface() -> Surface {
        let p = ChorusColors.themed(for: colorScheme)
        switch variant {
        case .filter:
            if selected {
                return Surface(background: p.inverseSurface, label: p.inverseOnSurface, border: nil)
            } else {
                return Surface(
                    background: .clear,
                    label: p.onSurface,
                    border: (ChorusBorderWidth.hairline, p.outlineVariant)
                )
            }
        case .tag:
            let bg = colorScheme == .dark
                ? ChorusPalette.White.s200
                : ChorusPalette.Black.s200
            return Surface(background: bg, label: p.onSurface, border: nil)
        }
    }
}

private struct ChipButtonStyle: ButtonStyle {
    let surface: ChorusChip.Surface
    let radius: CGFloat

    func makeBody(configuration: Configuration) -> some View {
        ZStack {
            RoundedRectangle(cornerRadius: radius, style: .continuous)
                .fill(surface.background)
            if configuration.isPressed {
                RoundedRectangle(cornerRadius: radius, style: .continuous)
                    .fill(surface.label.opacity(ChorusStateOpacity.pressed))
            }
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
