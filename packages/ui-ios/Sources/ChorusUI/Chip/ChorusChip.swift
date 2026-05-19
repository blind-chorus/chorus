import SwiftUI
import ChorusTokens

/// SwiftUI port of the Chorus Chip family.
/// Specs: `schema/components/chip/filter.spec.json`, `.../tag.spec.json`.

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

    /// Tag chip — passive (omit `onDismiss`) or interactive (pass an
    /// `onDismiss` to render the × dismiss glyph and make the chip
    /// keyboard-focusable).
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
                    .buttonStyle(ChorusSurfaceButtonStyle(surface: surface, radius: s.radius))
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
                minHeight: 32,
                radius: ChorusRadius.full,
                iconSize: ChorusIconSize.md,
                labelTypo: ChorusTypography.Label.sm
            )
        case .tag:
            return Sizing(
                paddingBlock: ChorusLayout.Container.s2xs,
                paddingInline: ChorusLayout.Container.xs,
                labelInset: ChorusLayout.Container.s2xs,
                minHeight: 24,
                radius: ChorusRadius.sm,
                iconSize: ChorusIconSize.md,
                labelTypo: ChorusTypography.Label.sm
            )
        }
    }

    private func surface() -> ChorusSurface {
        let p = ChorusColors.themed(for: colorScheme)
        switch variant {
        case .filter:
            if selected {
                return ChorusSurface(background: p.inverseSurface, label: p.inverseOnSurface, border: nil)
            }
            return ChorusSurface(
                background: .clear,
                label: p.onSurface,
                border: (ChorusBorderWidth.hairline, p.outlineVariant)
            )
        case .tag:
            // Tag's translucent neutral has to flip across themes so the
            // chip adapts to whichever surface sits behind it; the rest
            // of the palette is theme-resolved already.
            let bg = colorScheme == .dark
                ? ChorusPalette.White.s200
                : ChorusPalette.Black.s200
            return ChorusSurface(background: bg, label: p.onSurface, border: nil)
        }
    }
}
