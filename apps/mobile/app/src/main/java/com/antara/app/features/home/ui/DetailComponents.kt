package com.antara.app.features.home.ui

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ArrowBack
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextOverflow
import com.antara.app.R
import com.antara.app.core.designsystem.AntaraTheme
import com.antara.app.core.designsystem.components.AntaraBadgeIconButton
import com.antara.app.core.designsystem.components.AntaraCircleIcon

/** Barra superior del detalle: volver, título y acciones del sistema. */
@Composable
fun DetailTopBar(
    title: String,
    onBack: () -> Unit,
    onNotificationsClick: () -> Unit,
    onFavoritesClick: () -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .statusBarsPadding()
            .padding(start = AntaraTheme.spacing.sm, end = AntaraTheme.spacing.sm, top = AntaraTheme.spacing.xs),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        AntaraCircleIcon(
            icon = Icons.AutoMirrored.Outlined.ArrowBack,
            contentDescription = stringResource(R.string.detail_back),
            onClick = onBack,
            background = AntaraTheme.extendedColors.surfaceElevated,
        )
        Spacer(Modifier.width(AntaraTheme.spacing.xs))
        Text(
            text = title,
            style = AntaraTheme.typography.titleLarge,
            color = AntaraTheme.colorScheme.onBackground,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            modifier = Modifier.weight(1f),
        )
        AntaraBadgeIconButton(
            icon = Icons.Outlined.Notifications,
            contentDescription = stringResource(R.string.home_notifications),
            badgeText = "12",
            onClick = onNotificationsClick,
        )
        AntaraCircleIcon(
            icon = Icons.Outlined.FavoriteBorder,
            contentDescription = stringResource(R.string.home_favorites),
            onClick = onFavoritesClick,
            background = androidx.compose.ui.graphics.Color.Transparent,
        )
    }
}

/** Resumen del contenido (nº de canciones) bajo el título. */
@Composable
fun DetailSummary(count: Int) {
    Text(
        text = stringResource(R.string.detail_song_count, count),
        style = AntaraTheme.typography.bodyMedium,
        color = AntaraTheme.extendedColors.textSecondary,
        modifier = Modifier.padding(horizontal = AntaraTheme.spacing.lg),
    )
}
