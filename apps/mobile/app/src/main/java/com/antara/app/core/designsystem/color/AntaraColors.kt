package com.antara.app.core.designsystem.color

import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

/**
 * Tokens de color del sistema de diseño global (docs/design-system.md).
 * Estos son los ÚNICOS colores permitidos en la app; ningún componente define colores propios.
 */
object AntaraDarkTokens {
    val Background = Color(0xFF0D0D12)
    val Surface = Color(0xFF15151C)
    val SurfaceElevated = Color(0xFF1E1E27)
    val SurfaceHover = Color(0xFF25252F)
    val Primary = Color(0xFF8B3BFF)
    val PrimaryHover = Color(0xFF7C33E6)
    val PrimaryPressed = Color(0xFF6D2CCE)
    val Accent = Color(0xFF2DD4BF)
    val AccentWarm = Color(0xFFFFB84D)
    val TextPrimary = Color(0xFFF4F4F6)
    val TextSecondary = Color(0xFFA3A3B2)
    val TextDisabled = Color(0xFF5C5C6B)
    val Border = Color(0xFF2A2A36)
    val BorderStrong = Color(0xFF3D3D4D)
    val Success = Color(0xFF34D399)
    val Warning = Color(0xFFFBBF24)
    val Error = Color(0xFFEF4444)
    val Info = Color(0xFF38BDF8)
    val OverlayScrim = Color(0xB3000000)
}

object AntaraLightTokens {
    val Background = Color(0xFFFAFAFC)
    val Surface = Color(0xFFFFFFFF)
    val SurfaceElevated = Color(0xFFFFFFFF)
    val SurfaceHover = Color(0xFFF0F0F5)
    val Primary = Color(0xFF7C33E6)
    val TextPrimary = Color(0xFF17171C)
    val TextSecondary = Color(0xFF5C5C6B)
    val Border = Color(0xFFE5E5EC)
}

/** Esquema Material 3 oscuro (predeterminado) mapeado a los tokens globales. */
val AntaraDarkColorScheme = darkColorScheme(
    primary = AntaraDarkTokens.Primary,
    onPrimary = Color.White, // blanco puro reservado para texto sobre primario (design-system.md)
    primaryContainer = AntaraDarkTokens.PrimaryPressed,
    onPrimaryContainer = Color(0xFFE8D8FF),
    secondary = AntaraDarkTokens.Accent,
    onSecondary = AntaraDarkTokens.Background,
    secondaryContainer = Color(0xFF1A2E2B),
    onSecondaryContainer = Color(0xFFA9F5E9),
    tertiary = AntaraDarkTokens.AccentWarm,
    onTertiary = AntaraDarkTokens.Background,
    tertiaryContainer = Color(0xFF3A2E1A),
    onTertiaryContainer = Color(0xFFFFE0B0),
    background = AntaraDarkTokens.Background,
    onBackground = AntaraDarkTokens.TextPrimary,
    surface = AntaraDarkTokens.Surface,
    onSurface = AntaraDarkTokens.TextPrimary,
    surfaceVariant = AntaraDarkTokens.SurfaceElevated,
    onSurfaceVariant = AntaraDarkTokens.TextSecondary,
    surfaceTint = AntaraDarkTokens.Primary,
    outline = AntaraDarkTokens.Border,
    outlineVariant = AntaraDarkTokens.BorderStrong,
    error = AntaraDarkTokens.Error,
    onError = Color.White,
    errorContainer = Color(0xFF3A1A1A),
    onErrorContainer = Color(0xFFFFC9C9),
    inverseSurface = AntaraDarkTokens.TextPrimary,
    inverseOnSurface = AntaraDarkTokens.Background,
    inversePrimary = AntaraDarkTokens.Primary,
    scrim = AntaraDarkTokens.OverlayScrim,
)

/** Esquema Material 3 claro (opcional; mantener consistencia con tokens). */
val AntaraLightColorScheme = lightColorScheme(
    primary = AntaraLightTokens.Primary,
    onPrimary = Color.White,
    background = AntaraLightTokens.Background,
    onBackground = AntaraLightTokens.TextPrimary,
    surface = AntaraLightTokens.Surface,
    onSurface = AntaraLightTokens.TextPrimary,
    surfaceVariant = AntaraLightTokens.SurfaceElevated,
    onSurfaceVariant = AntaraLightTokens.TextSecondary,
    outline = AntaraLightTokens.Border,
    error = AntaraLightTokens.Primary, // simplificado; se completa al añadir tema claro real
)

/**
 * Roles adicionales del sistema de diseño que Material 3 no expone directamente.
 * Se acceden vía `AntaraTheme.extendedColors`.
 */
class AntaraExtendedColors(
    val surfaceElevated: Color,
    val surfaceHover: Color,
    val accent: Color,
    val accentWarm: Color,
    val textPrimary: Color,
    val textSecondary: Color,
    val textDisabled: Color,
    val border: Color,
    val borderStrong: Color,
    val success: Color,
    val warning: Color,
    val info: Color,
)

internal val LocalAntaraExtendedColors = staticCompositionLocalOf {
    AntaraExtendedColors(
        surfaceElevated = AntaraDarkTokens.SurfaceElevated,
        surfaceHover = AntaraDarkTokens.SurfaceHover,
        accent = AntaraDarkTokens.Accent,
        accentWarm = AntaraDarkTokens.AccentWarm,
        textPrimary = AntaraDarkTokens.TextPrimary,
        textSecondary = AntaraDarkTokens.TextSecondary,
        textDisabled = AntaraDarkTokens.TextDisabled,
        border = AntaraDarkTokens.Border,
        borderStrong = AntaraDarkTokens.BorderStrong,
        success = AntaraDarkTokens.Success,
        warning = AntaraDarkTokens.Warning,
        info = AntaraDarkTokens.Info,
    )
}
