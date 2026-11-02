package com.antara.app.features.servers.ui

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ArrowBack
import androidx.compose.material.icons.outlined.CheckCircle
import androidx.compose.material.icons.outlined.Delete
import androidx.compose.material.icons.outlined.Dns
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.BorderStroke
import androidx.lifecycle.viewmodel.compose.viewModel
import com.antara.app.R
import com.antara.app.core.designsystem.AntaraTheme
import com.antara.app.core.designsystem.components.AntaraCircleIcon
import com.antara.app.core.designsystem.components.AntaraPrimaryButton
import com.antara.app.core.designsystem.components.AntaraTextField
import com.antara.app.domain.model.ServerConfig
import com.antara.app.domain.repository.ServerRepository
import com.antara.app.features.servers.ServersViewModel

/**
 * Configuración de servidores: permite guardar una o varias IP/dominios,
 * elegir el activo y eliminar los que ya no se usan.
 */
@Composable
fun ServersScreen(
    serverRepository: ServerRepository,
    firstRun: Boolean,
    onBack: () -> Unit,
    onContinue: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val factory = remember(serverRepository) { ServersViewModel.factory(serverRepository) }
    val viewModel: ServersViewModel = viewModel(factory = factory)
    val state by viewModel.uiState.collectAsState()

    BackHandler(enabled = true) {
        if (!firstRun) onBack()
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(AntaraTheme.colorScheme.background)
            .statusBarsPadding()
            .navigationBarsPadding()
            .imePadding(),
    ) {
        ServersTopBar(
            firstRun = firstRun,
            onBack = onBack,
        )
        LazyColumn(
            modifier = Modifier.weight(1f),
            contentPadding = PaddingValues(
                start = AntaraTheme.spacing.lg,
                end = AntaraTheme.spacing.lg,
                top = AntaraTheme.spacing.sm,
                bottom = AntaraTheme.spacing.lg,
            ),
            verticalArrangement = Arrangement.spacedBy(AntaraTheme.spacing.md),
        ) {
            item(key = "intro") {
                Text(
                    text = stringResource(R.string.servers_intro),
                    style = AntaraTheme.typography.bodyMedium,
                    color = AntaraTheme.extendedColors.textSecondary,
                )
            }
            if (firstRun) {
                item(key = "first-run") {
                    FirstRunBanner()
                }
            }
            item(key = "input") {
                AntaraTextField(
                    value = state.input,
                    onValueChange = viewModel::onInputChange,
                    placeholder = stringResource(R.string.servers_input_placeholder),
                    leadingIcon = Icons.Outlined.Dns,
                    isError = state.errorRes != null,
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.Uri,
                        imeAction = ImeAction.Done,
                    ),
                    keyboardActions = KeyboardActions(onDone = { viewModel.addServer() }),
                )
                if (state.errorRes != null) {
                    Text(
                        text = stringResource(state.errorRes!!),
                        style = AntaraTheme.typography.labelMedium,
                        color = AntaraTheme.colorScheme.error,
                        modifier = Modifier.padding(
                            start = AntaraTheme.spacing.sm,
                            top = AntaraTheme.spacing.xs,
                        ),
                    )
                }
            }
            item(key = "add") {
                AntaraPrimaryButton(
                    text = stringResource(R.string.servers_add),
                    onClick = viewModel::addServer,
                    modifier = Modifier.fillMaxWidth(),
                    enabled = state.input.isNotBlank(),
                    loading = state.isSaving,
                )
            }
            item(key = "saved-title") {
                Spacer(Modifier.height(AntaraTheme.spacing.sm))
                Text(
                    text = stringResource(R.string.servers_saved),
                    style = AntaraTheme.typography.titleLarge,
                    color = AntaraTheme.colorScheme.onBackground,
                )
            }
            if (state.servers.isEmpty()) {
                item(key = "empty") {
                    EmptyServers()
                }
            } else {
                items(state.servers, key = { it.address }) { server ->
                    ServerCard(
                        server = server,
                        onSelect = { viewModel.setActive(server.address) },
                        onDelete = { viewModel.removeServer(server.address) },
                    )
                }
            }
        }
        if (state.servers.isNotEmpty()) {
            AntaraPrimaryButton(
                text = stringResource(R.string.servers_continue),
                onClick = onContinue,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(
                        start = AntaraTheme.spacing.lg,
                        end = AntaraTheme.spacing.lg,
                        bottom = AntaraTheme.spacing.md,
                    ),
            )
        }
    }
}

@Composable
private fun ServersTopBar(
    firstRun: Boolean,
    onBack: () -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = AntaraTheme.spacing.sm, vertical = AntaraTheme.spacing.xs),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (!firstRun) {
            AntaraCircleIcon(
                icon = Icons.AutoMirrored.Outlined.ArrowBack,
                contentDescription = stringResource(R.string.detail_back),
                onClick = onBack,
                background = AntaraTheme.extendedColors.surfaceElevated,
            )
        } else {
            Spacer(Modifier.size(48.dp))
        }
        Spacer(Modifier.width(AntaraTheme.spacing.xs))
        Text(
            text = stringResource(R.string.servers_title),
            style = AntaraTheme.typography.titleLarge,
            color = AntaraTheme.colorScheme.onBackground,
        )
    }
}

@Composable
private fun FirstRunBanner() {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = AntaraTheme.shapes.medium,
        color = AntaraTheme.extendedColors.surfaceElevated,
        border = BorderStroke(1.dp, AntaraTheme.extendedColors.warning),
    ) {
        Row(
            modifier = Modifier.padding(AntaraTheme.spacing.md),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(
                imageVector = Icons.Outlined.Info,
                contentDescription = null,
                tint = AntaraTheme.extendedColors.warning,
            )
            Spacer(Modifier.width(AntaraTheme.spacing.sm))
            Text(
                text = stringResource(R.string.servers_first_run),
                style = AntaraTheme.typography.bodySmall,
                color = AntaraTheme.extendedColors.textSecondary,
            )
        }
    }
}

@Composable
private fun EmptyServers() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = AntaraTheme.spacing.xl),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Icon(
            imageVector = Icons.Outlined.Dns,
            contentDescription = null,
            tint = AntaraTheme.extendedColors.textDisabled,
            modifier = Modifier.size(56.dp),
        )
        Spacer(Modifier.height(AntaraTheme.spacing.md))
        Text(
            text = stringResource(R.string.servers_empty_title),
            style = AntaraTheme.typography.titleMedium,
            color = AntaraTheme.colorScheme.onBackground,
        )
        Spacer(Modifier.height(AntaraTheme.spacing.xs))
        Text(
            text = stringResource(R.string.servers_empty_description),
            style = AntaraTheme.typography.bodySmall,
            color = AntaraTheme.extendedColors.textSecondary,
            textAlign = androidx.compose.ui.text.style.TextAlign.Center,
        )
    }
}

@Composable
private fun ServerCard(
    server: ServerConfig,
    onSelect: () -> Unit,
    onDelete: () -> Unit,
) {
    Surface(
        onClick = onSelect,
        modifier = Modifier.fillMaxWidth(),
        shape = AntaraTheme.shapes.medium,
        color = AntaraTheme.extendedColors.surfaceElevated,
        border = BorderStroke(
            width = 1.dp,
            color = if (server.isActive) {
                AntaraTheme.colorScheme.primary
            } else {
                AntaraTheme.extendedColors.border
            },
        ),
    ) {
        Row(
            modifier = Modifier.padding(
                start = AntaraTheme.spacing.md,
                end = AntaraTheme.spacing.xs,
                top = AntaraTheme.spacing.sm,
                bottom = AntaraTheme.spacing.sm,
            ),
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
            Spacer(Modifier.width(AntaraTheme.spacing.md))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = server.displayName,
                    style = AntaraTheme.typography.titleSmall,
                    color = AntaraTheme.colorScheme.onSurface,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
                Text(
                    text = if (server.isActive) {
                        stringResource(R.string.servers_active)
                    } else {
                        stringResource(R.string.servers_use)
                    },
                    style = AntaraTheme.typography.bodySmall,
                    color = if (server.isActive) {
                        AntaraTheme.extendedColors.accent
                    } else {
                        AntaraTheme.extendedColors.textSecondary
                    },
                )
            }
            if (server.isActive) {
                Icon(
                    imageVector = Icons.Outlined.CheckCircle,
                    contentDescription = null,
                    tint = AntaraTheme.extendedColors.accent,
                    modifier = Modifier.size(22.dp),
                )
            }
            IconButton(onClick = onDelete) {
                Icon(
                    imageVector = Icons.Outlined.Delete,
                    contentDescription = stringResource(R.string.servers_delete),
                    tint = AntaraTheme.extendedColors.textSecondary,
                )
            }
        }
    }
}
