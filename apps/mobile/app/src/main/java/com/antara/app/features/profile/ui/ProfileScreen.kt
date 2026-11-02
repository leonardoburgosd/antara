package com.antara.app.features.profile.ui

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.Logout
import androidx.compose.material.icons.outlined.Dns
import androidx.compose.material.icons.outlined.KeyboardArrowRight
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.antara.app.R
import com.antara.app.core.designsystem.AntaraTheme
import com.antara.app.core.designsystem.components.AntaraSecondaryButton
import com.antara.app.domain.model.ServerConfig
import com.antara.app.domain.model.UserSession

/** Perfil del usuario: datos de sesión, servidor activo y cierre de sesión. */
@Composable
fun ProfileScreen(
    session: UserSession,
    activeServer: ServerConfig?,
    onOpenServers: () -> Unit,
    onSignOut: () -> Unit,
    bottomContentPadding: Dp = 0.dp,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .background(AntaraTheme.colorScheme.background)
            .verticalScroll(rememberScrollState())
            .padding(
                start = AntaraTheme.spacing.lg,
                top = AntaraTheme.spacing.md,
                end = AntaraTheme.spacing.lg,
                bottom = AntaraTheme.spacing.md + bottomContentPadding,
            ),
    ) {
        Text(
            text = stringResource(R.string.profile_title),
            style = AntaraTheme.typography.titleLarge,
            color = AntaraTheme.colorScheme.onBackground,
        )
        Spacer(Modifier.height(AntaraTheme.spacing.xl))
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(72.dp)
                    .clip(CircleShape)
                    .background(AntaraTheme.colorScheme.primary),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    text = session.name.trim().firstOrNull()?.uppercase() ?: "A",
                    style = AntaraTheme.typography.displaySmall,
                    color = AntaraTheme.colorScheme.onPrimary,
                )
            }
            Spacer(Modifier.size(AntaraTheme.spacing.lg))
            Column {
                Text(
                    text = session.name,
                    style = AntaraTheme.typography.headlineMedium,
                    color = AntaraTheme.colorScheme.onBackground,
                )
                Text(
                    text = session.email,
                    style = AntaraTheme.typography.bodyMedium,
                    color = AntaraTheme.extendedColors.textSecondary,
                )
            }
        }
        Spacer(Modifier.height(AntaraTheme.spacing.xxl))
        Text(
            text = stringResource(R.string.profile_active_server),
            style = AntaraTheme.typography.labelLarge,
            color = AntaraTheme.extendedColors.textSecondary,
        )
        Spacer(Modifier.height(AntaraTheme.spacing.sm))
        Surface(
            onClick = onOpenServers,
            modifier = Modifier.fillMaxWidth(),
            shape = AntaraTheme.shapes.medium,
            color = AntaraTheme.extendedColors.surfaceElevated,
            border = BorderStroke(1.dp, AntaraTheme.extendedColors.border),
        ) {
            Row(
                modifier = Modifier.padding(AntaraTheme.spacing.md),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(AntaraTheme.extendedColors.surfaceHover),
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(
                        imageVector = Icons.Outlined.Dns,
                        contentDescription = null,
                        tint = AntaraTheme.colorScheme.primary,
                        modifier = Modifier.size(22.dp),
                    )
                }
                Spacer(Modifier.size(AntaraTheme.spacing.md))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = activeServer?.displayName
                            ?: stringResource(R.string.profile_no_server),
                        style = AntaraTheme.typography.titleSmall,
                        color = AntaraTheme.colorScheme.onSurface,
                    )
                    Text(
                        text = stringResource(R.string.profile_configure_servers),
                        style = AntaraTheme.typography.bodySmall,
                        color = AntaraTheme.extendedColors.textSecondary,
                    )
                }
                Icon(
                    imageVector = Icons.Outlined.KeyboardArrowRight,
                    contentDescription = null,
                    tint = AntaraTheme.extendedColors.textSecondary,
                )
            }
        }
        Spacer(Modifier.height(AntaraTheme.spacing.xl))
        AntaraSecondaryButton(
            text = stringResource(R.string.profile_configure_servers),
            onClick = onOpenServers,
            modifier = Modifier.fillMaxWidth(),
        )
        Spacer(Modifier.height(AntaraTheme.spacing.sm))
        AntaraSecondaryButton(
            text = stringResource(R.string.profile_sign_out),
            onClick = onSignOut,
            modifier = Modifier.fillMaxWidth(),
            contentColor = AntaraTheme.colorScheme.error,
        )
        Spacer(Modifier.height(AntaraTheme.spacing.xxl))
    }
}
