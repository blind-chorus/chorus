import SwiftUI
import ChorusTokens

/// The three properties every Chorus pressable surface resolves before
/// rendering: a background, a label color, and an optional outline.
/// Both Button and Chip reduce to "pick a surface, then render the
/// content over it" — see ChorusSurfaceButtonStyle for the shared
/// foreground-over-base composition.
struct ChorusSurface {
    let background: Color
    let label: Color
    let border: (width: CGFloat, color: Color)?
}

/// SwiftUI ButtonStyle that paints a Chorus surface and overlays the
/// pressed-state scrim per the spec's "foreground-over-base" rule.
/// Disabled-state container dim is applied at the parent view via
/// `.opacity(...)` so this style stays single-purpose.
struct ChorusSurfaceButtonStyle: ButtonStyle {
    let surface: ChorusSurface
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
