package com.antara.app.features.library.ui

import android.content.Intent
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.DeleteOutline
import androidx.compose.material.icons.outlined.FolderOpen
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.antara.app.R
import com.antara.app.core.designsystem.AntaraTheme
import com.antara.app.core.designsystem.color.AntaraDarkTokens
import com.antara.app.core.designsystem.components.AntaraPrimaryButton
import com.antara.app.core.designsystem.components.AntaraTrackRow
import com.antara.app.domain.model.LocalAudio
import com.antara.app.domain.repository.LocalAudioRepository
import kotlinx.coroutines.launch

private val CoverColors = listOf(
    AntaraDarkTokens.Primary,
    AntaraDarkTokens.Accent,
    AntaraDarkTokens.AccentWarm,
    AntaraDarkTokens.Info,
    AntaraDarkTokens.Success,
    AntaraDarkTokens.Error,
)

/**
 * Biblioteca: archivos de audio del dispositivo que el usuario añade con el
 * selector del sistema (SAF). Se guardan sus URIs y se reproducen con Media3.
 */
@Composable
fun LibraryScreen(
    repository: LocalAudioRepository,
    currentId: String?,
    isPlaying: Boolean,
    onPlay: (List<LocalAudio>, Int) -> Unit,
    bottomContentPadding: Dp = 0.dp,
    modifier: Modifier = Modifier,
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val files by repository.files.collectAsState()

    val picker = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.OpenMultipleDocuments(),
    ) { uris ->
        if (uris.isNotEmpty()) {
            uris.forEach { uri ->
                runCatching {
                    context.contentResolver.takePersistableUriPermission(
                        uri,
                        Intent.FLAG_GRANT_READ_URI_PERMISSION,
                    )
                }
            }
            scope.launch { repository.add(uris.map { it.toString() }) }
        }
    }

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
            text = stringResource(R.string.nav_library),
            style = AntaraTheme.typography.titleLarge,
            color = AntaraTheme.colorScheme.onBackground,
        )
        Spacer(Modifier.height(AntaraTheme.spacing.xl))
        Text(
            text = stringResource(R.string.library_files_title),
            style = AntaraTheme.typography.headlineMedium,
            color = AntaraTheme.colorScheme.onBackground,
        )
        Spacer(Modifier.height(AntaraTheme.spacing.xs))
        Text(
            text = stringResource(R.string.library_files_description),
            style = AntaraTheme.typography.bodyMedium,
            color = AntaraTheme.extendedColors.textSecondary,
        )
        Spacer(Modifier.height(AntaraTheme.spacing.lg))
        AntaraPrimaryButton(
            text = stringResource(R.string.library_upload),
            onClick = { picker.launch(arrayOf("audio/*")) },
            modifier = Modifier.fillMaxWidth(),
        )
        Spacer(Modifier.height(AntaraTheme.spacing.xl))

        if (files.isEmpty()) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = AntaraTheme.spacing.xxl),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(AntaraTheme.spacing.sm),
            ) {
                Icon(
                    imageVector = Icons.Outlined.FolderOpen,
                    contentDescription = null,
                    tint = AntaraTheme.extendedColors.textDisabled,
                    modifier = Modifier.height(40.dp),
                )
                Text(
                    text = stringResource(R.string.library_empty_title),
                    style = AntaraTheme.typography.titleSmall,
                    color = AntaraTheme.colorScheme.onSurface,
                    textAlign = TextAlign.Center,
                )
                Text(
                    text = stringResource(R.string.library_empty_description),
                    style = AntaraTheme.typography.bodySmall,
                    color = AntaraTheme.extendedColors.textSecondary,
                    textAlign = TextAlign.Center,
                )
            }
        } else {
            files.forEachIndexed { index, file ->
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    AntaraTrackRow(
                        title = file.title,
                        subtitle = stringResource(R.string.library_file_subtitle),
                        coverColor = CoverColors[index % CoverColors.size],
                        isCurrent = currentId == file.uri,
                        isPlaying = isPlaying,
                        onPlay = { onPlay(files, index) },
                        onRowClick = { onPlay(files, index) },
                        modifier = Modifier.weight(1f),
                    )
                    IconButton(
                        onClick = { scope.launch { repository.remove(file.uri) } },
                        modifier = Modifier.padding(end = AntaraTheme.spacing.sm),
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.DeleteOutline,
                            contentDescription = stringResource(R.string.library_remove),
                            tint = AntaraTheme.extendedColors.textSecondary,
                        )
                    }
                }
            }
        }
    }
}
