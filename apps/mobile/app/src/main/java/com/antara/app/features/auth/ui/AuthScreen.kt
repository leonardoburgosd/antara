package com.antara.app.features.auth.ui

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
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
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.KeyboardArrowRight
import androidx.compose.material.icons.outlined.Dns
import androidx.compose.material.icons.outlined.Lock
import androidx.compose.material.icons.outlined.MailOutline
import androidx.compose.material.icons.outlined.MusicNote
import androidx.compose.material.icons.outlined.Visibility
import androidx.compose.material.icons.outlined.VisibilityOff
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
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.antara.app.R
import com.antara.app.core.designsystem.AntaraTheme
import com.antara.app.core.designsystem.components.AntaraPrimaryButton
import com.antara.app.core.designsystem.components.AntaraTextField
import com.antara.app.domain.model.ServerConfig
import com.antara.app.domain.repository.SessionRepository
import com.antara.app.features.auth.AuthViewModel

/**
 * Pantalla de inicio de sesión. Mientras no exista backend, es un formulario
 * demo con validación local y sesión persistida en DataStore.
 *
 * Incluye acceso a la configuración de servidores para elegir la IP o el dominio
 * al que se conectará la app antes de entrar.
 */
@Composable
fun AuthScreen(
    sessionRepository: SessionRepository,
    activeServer: ServerConfig?,
    onOpenServers: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val factory = remember(sessionRepository) { AuthViewModel.factory(sessionRepository) }
    val viewModel: AuthViewModel = viewModel(factory = factory)
    val state by viewModel.uiState.collectAsState()

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(AntaraTheme.colorScheme.background),
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .navigationBarsPadding()
                .imePadding()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = AntaraTheme.spacing.xl, vertical = AntaraTheme.spacing.xl),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Spacer(Modifier.height(AntaraTheme.spacing.xxl))
            Box(
                modifier = Modifier
                    .size(84.dp)
                    .clip(CircleShape)
                    .background(AntaraTheme.colorScheme.primary),
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    imageVector = Icons.Outlined.MusicNote,
                    contentDescription = null,
                    tint = AntaraTheme.colorScheme.onPrimary,
                    modifier = Modifier.size(40.dp),
                )
            }
            Spacer(Modifier.height(AntaraTheme.spacing.md))
            Text(
                text = stringResource(R.string.app_name),
                style = AntaraTheme.typography.displayMedium,
                color = AntaraTheme.colorScheme.onBackground,
            )
            Text(
                text = stringResource(R.string.auth_tagline),
                style = AntaraTheme.typography.bodyMedium,
                color = AntaraTheme.extendedColors.textSecondary,
                textAlign = TextAlign.Center,
            )
            Spacer(Modifier.height(AntaraTheme.spacing.xxl))

            Column(
                modifier = Modifier
                    .widthIn(max = 480.dp)
                    .fillMaxWidth(),
            ) {
                Text(
                    text = stringResource(R.string.auth_login_title),
                    style = AntaraTheme.typography.headlineMedium,
                    color = AntaraTheme.colorScheme.onBackground,
                )
                Spacer(Modifier.height(AntaraTheme.spacing.lg))

                AntaraTextField(
                    value = state.email,
                    onValueChange = viewModel::onEmailChange,
                    placeholder = stringResource(R.string.auth_email),
                    leadingIcon = Icons.Outlined.MailOutline,
                    isError = state.emailErrorRes != null,
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.Email,
                        imeAction = ImeAction.Next,
                    ),
                )
                FieldError(state.emailErrorRes)
                Spacer(Modifier.height(AntaraTheme.spacing.md))

                AntaraTextField(
                    value = state.password,
                    onValueChange = viewModel::onPasswordChange,
                    placeholder = stringResource(R.string.auth_password),
                    leadingIcon = Icons.Outlined.Lock,
                    trailingIcon = {
                        IconButton(onClick = viewModel::togglePasswordVisibility) {
                            Icon(
                                imageVector = if (state.passwordVisible) {
                                    Icons.Outlined.VisibilityOff
                                } else {
                                    Icons.Outlined.Visibility
                                },
                                contentDescription = stringResource(
                                    if (state.passwordVisible) {
                                        R.string.auth_hide_password
                                    } else {
                                        R.string.auth_show_password
                                    },
                                ),
                                tint = AntaraTheme.extendedColors.textSecondary,
                            )
                        }
                    },
                    isError = state.passwordErrorRes != null,
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.Password,
                        imeAction = ImeAction.Done,
                    ),
                    keyboardActions = KeyboardActions(onDone = { viewModel.submit() }),
                    visualTransformation = if (state.passwordVisible) {
                        VisualTransformation.None
                    } else {
                        PasswordVisualTransformation()
                    },
                )
                FieldError(state.passwordErrorRes)
                FieldError(state.generalErrorRes)
                Spacer(Modifier.height(AntaraTheme.spacing.xl))

                AntaraPrimaryButton(
                    text = stringResource(R.string.auth_enter),
                    onClick = viewModel::submit,
                    modifier = Modifier.fillMaxWidth(),
                    loading = state.isLoading,
                )
                Spacer(Modifier.height(AntaraTheme.spacing.md))
                Text(
                    text = stringResource(R.string.auth_demo_hint),
                    style = AntaraTheme.typography.labelSmall,
                    color = AntaraTheme.extendedColors.textDisabled,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth(),
                )

                Spacer(Modifier.height(AntaraTheme.spacing.xl))
                ServerAccessCard(
                    activeServer = activeServer,
                    onClick = onOpenServers,
                )
            }
            Spacer(Modifier.height(AntaraTheme.spacing.xxl))
        }
    }
}

/** Tarjeta que muestra el servidor activo (o invita a añadirlo) y abre su configuración. */
@Composable
private fun ServerAccessCard(
    activeServer: ServerConfig?,
    onClick: () -> Unit,
) {
    Surface(
        onClick = onClick,
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
                        ?: stringResource(R.string.auth_server_empty),
                    style = AntaraTheme.typography.titleSmall,
                    color = AntaraTheme.colorScheme.onSurface,
                )
                Text(
                    text = stringResource(
                        if (activeServer == null) {
                            R.string.auth_server_add_description
                        } else {
                            R.string.auth_server_change
                        },
                    ),
                    style = AntaraTheme.typography.bodySmall,
                    color = AntaraTheme.extendedColors.textSecondary,
                )
            }
            Icon(
                imageVector = Icons.AutoMirrored.Outlined.KeyboardArrowRight,
                contentDescription = null,
                tint = AntaraTheme.extendedColors.textSecondary,
            )
        }
    }
}

@Composable
private fun FieldError(errorRes: Int?) {
    if (errorRes == null) return
    Text(
        text = stringResource(errorRes),
        style = AntaraTheme.typography.labelMedium,
        color = AntaraTheme.colorScheme.error,
        modifier = Modifier.padding(start = AntaraTheme.spacing.sm, top = AntaraTheme.spacing.xs),
    )
}
