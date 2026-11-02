package com.antara.app.core.designsystem.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Dns
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material3.Badge
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.antara.app.core.designsystem.AntaraTheme

/** Botón primario del design system (48dp, radio md, texto `button`). */
@Composable
fun AntaraPrimaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    loading: Boolean = false,
) {
    Button(
        onClick = onClick,
        enabled = enabled && !loading,
        modifier = modifier.height(48.dp),
        shape = AntaraTheme.shapes.medium,
        colors = ButtonDefaults.buttonColors(
            containerColor = AntaraTheme.colorScheme.primary,
            contentColor = AntaraTheme.colorScheme.onPrimary,
            disabledContainerColor = AntaraTheme.extendedColors.surfaceElevated,
            disabledContentColor = AntaraTheme.extendedColors.textDisabled,
        ),
    ) {
        if (loading) {
            CircularProgressIndicator(
                modifier = Modifier.size(20.dp),
                color = AntaraTheme.colorScheme.onPrimary,
                strokeWidth = 2.dp,
            )
        } else {
            Text(
                text = text,
                style = AntaraTheme.typography.labelLarge,
                modifier = Modifier.padding(horizontal = AntaraTheme.spacing.sm),
            )
        }
    }
}

/** Botón secundario: superficie elevada con borde. */
@Composable
fun AntaraSecondaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    contentColor: Color = AntaraTheme.colorScheme.onSurface,
) {
    OutlinedButton(
        onClick = onClick,
        enabled = enabled,
        modifier = modifier.height(48.dp),
        shape = AntaraTheme.shapes.medium,
        border = androidx.compose.foundation.BorderStroke(
            width = 1.dp,
            color = AntaraTheme.extendedColors.borderStrong,
        ),
        colors = ButtonDefaults.outlinedButtonColors(
            containerColor = AntaraTheme.extendedColors.surfaceElevated,
            contentColor = contentColor,
        ),
    ) {
        Text(text = text, style = AntaraTheme.typography.labelLarge)
    }
}

/** Acción de texto (ghost) para enlaces y "Ver todo". */
@Composable
fun AntaraGhostButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    contentColor: Color = AntaraTheme.colorScheme.primary,
) {
    TextButton(onClick = onClick, modifier = modifier.height(48.dp)) {
        Text(
            text = text,
            style = AntaraTheme.typography.labelLarge,
            color = contentColor,
        )
    }
}

/**
 * Botón de icono circular (área táctil 48dp, círculo visual 40dp).
 * Usado en cabeceras y acciones de fila.
 */
@Composable
fun AntaraCircleIcon(
    icon: ImageVector,
    contentDescription: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    background: Color = AntaraTheme.extendedColors.surfaceElevated,
    tint: Color = AntaraTheme.colorScheme.onSurface,
    iconSize: Dp = 22.dp,
) {
    Box(
        modifier = modifier
            .size(48.dp)
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center,
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .background(background, CircleShape),
            contentAlignment = Alignment.Center,
        ) {
            Icon(
                imageVector = icon,
                contentDescription = contentDescription,
                tint = tint,
                modifier = Modifier.size(iconSize),
            )
        }
    }
}

/** Botón de icono con badge (campana de notificaciones). */
@Composable
fun AntaraBadgeIconButton(
    icon: ImageVector,
    contentDescription: String,
    badgeText: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    IconButton(onClick = onClick, modifier = modifier.size(48.dp)) {
        androidx.compose.material3.BadgedBox(
            badge = {
                Badge(
                    containerColor = AntaraTheme.colorScheme.primary,
                    contentColor = AntaraTheme.colorScheme.onPrimary,
                ) {
                    Text(text = badgeText, style = AntaraTheme.typography.labelSmall)
                }
            },
        ) {
            Icon(
                imageVector = icon,
                contentDescription = contentDescription,
                tint = AntaraTheme.colorScheme.onBackground,
                modifier = Modifier.size(24.dp),
            )
        }
    }
}

/** Fila reutilizable de acciones de cabecera (badge + favoritos + configuración). */
@Composable
fun AntaraHeaderActions(
    onNotificationsClick: () -> Unit,
    onFavoritesClick: () -> Unit,
    onServersClick: () -> Unit,
    notificationsDescription: String,
    favoritesDescription: String,
    serversDescription: String,
    badgeText: String = "12",
    modifier: Modifier = Modifier,
) {
    Row(modifier = modifier, verticalAlignment = Alignment.CenterVertically) {
        AntaraBadgeIconButton(
            icon = Icons.Outlined.Notifications,
            contentDescription = notificationsDescription,
            badgeText = badgeText,
            onClick = onNotificationsClick,
        )
        Spacer(Modifier.width(2.dp))
        AntaraCircleIcon(
            icon = Icons.Outlined.FavoriteBorder,
            contentDescription = favoritesDescription,
            onClick = onFavoritesClick,
            background = Color.Transparent,
            tint = AntaraTheme.colorScheme.onBackground,
        )
        AntaraCircleIcon(
            icon = Icons.Outlined.Dns,
            contentDescription = serversDescription,
            onClick = onServersClick,
            background = Color.Transparent,
            tint = AntaraTheme.colorScheme.onBackground,
        )
    }
}
