package com.antara.app.core.designsystem

import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import com.antara.app.core.designsystem.color.AntaraDarkColorScheme
import com.antara.app.core.designsystem.color.AntaraExtendedColors
import com.antara.app.core.designsystem.color.LocalAntaraExtendedColors
import com.antara.app.core.designsystem.shape.AntaraShapes
import com.antara.app.core.designsystem.spacing.AntaraSpacing

/**
 * Tema global de Antara (Material 3 personalizado con los tokens del design system).
 *
 * - Producto oscuro por defecto (uso predominantemente en ambientes oscuros).
 * - `dynamicColor` nunca se activa: consistencia de marca (ADR-009).
 * - Roles adicionales (accent, textSecondary, surfaceElevated…) vía `AntaraTheme.extendedColors`.
 */
@Composable
fun AntaraTheme(
    content: @Composable () -> Unit,
) {
    val colorScheme = AntaraDarkColorScheme

    CompositionLocalProvider(
        LocalAntaraExtendedColors provides AntaraExtendedColors(
            surfaceElevated = com.antara.app.core.designsystem.color.AntaraDarkTokens.SurfaceElevated,
            surfaceGlass = com.antara.app.core.designsystem.color.AntaraDarkTokens.SurfaceGlass,
            surfaceHover = com.antara.app.core.designsystem.color.AntaraDarkTokens.SurfaceHover,
            navIndicator = com.antara.app.core.designsystem.color.AntaraDarkTokens.NavIndicator,
            accent = com.antara.app.core.designsystem.color.AntaraDarkTokens.Accent,
            accentWarm = com.antara.app.core.designsystem.color.AntaraDarkTokens.AccentWarm,
            textPrimary = com.antara.app.core.designsystem.color.AntaraDarkTokens.TextPrimary,
            textSecondary = com.antara.app.core.designsystem.color.AntaraDarkTokens.TextSecondary,
            textDisabled = com.antara.app.core.designsystem.color.AntaraDarkTokens.TextDisabled,
            border = com.antara.app.core.designsystem.color.AntaraDarkTokens.Border,
            borderStrong = com.antara.app.core.designsystem.color.AntaraDarkTokens.BorderStrong,
            success = com.antara.app.core.designsystem.color.AntaraDarkTokens.Success,
            warning = com.antara.app.core.designsystem.color.AntaraDarkTokens.Warning,
            info = com.antara.app.core.designsystem.color.AntaraDarkTokens.Info,
        ),
    ) {
        MaterialTheme(
            colorScheme = colorScheme,
            typography = AntaraTypography,
            shapes = AntaraShapes,
            content = content,
        )
    }
}

/**
 * Acceso programático a los tokens del tema desde cualquier composable.
 *
 * Uso: `AntaraTheme.colorScheme.primary`, `AntaraTheme.extendedColors.accent`,
 * `AntaraTheme.typography.titleMedium`, `AntaraTheme.shapes.medium`.
 */
object AntaraTheme {
    val colorScheme
        @Composable get() = MaterialTheme.colorScheme

    val extendedColors
        @Composable get() = LocalAntaraExtendedColors.current

    val typography
        @Composable get() = MaterialTheme.typography

    val shapes
        @Composable get() = MaterialTheme.shapes

    /** Escala de espaciado global (4/8/12/16/24/32/48/64). */
    val spacing: AntaraSpacing get() = AntaraSpacing
}
