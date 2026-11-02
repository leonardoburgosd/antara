package com.antara.app.core.designsystem.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import com.antara.app.core.designsystem.AntaraTheme

/** Cabecera de sección con acción opcional ("Ver todo"). */
@Composable
fun AntaraSectionHeader(
    title: String,
    modifier: Modifier = Modifier,
    actionText: String? = null,
    onAction: (() -> Unit)? = null,
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            text = title,
            style = AntaraTheme.typography.titleLarge,
            color = AntaraTheme.colorScheme.onBackground,
        )
        if (actionText != null && onAction != null) {
            Text(
                text = actionText,
                style = AntaraTheme.typography.labelLarge,
                color = AntaraTheme.colorScheme.primary,
                modifier = Modifier
                    .clip(RoundedCornerShape(50))
                    .clickable(onClick = onAction)
                    .padding(horizontal = AntaraTheme.spacing.sm, vertical = AntaraTheme.spacing.xs),
            )
        }
    }
}
