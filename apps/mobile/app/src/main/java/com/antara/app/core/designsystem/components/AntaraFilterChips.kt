package com.antara.app.core.designsystem.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.antara.app.core.designsystem.AntaraTheme

/**
 * Fila de chips de filtro (Todos, Novedades, Tendencias, Top canciones).
 * Seleccionado: `primary` + `onPrimary`; inactivo: `surface-elevated` + `text-secondary`.
 */
@Composable
fun AntaraFilterChips(
    labels: List<String>,
    selectedIndex: Int,
    onSelect: (Int) -> Unit,
    modifier: Modifier = Modifier,
) {
    Row(
        modifier = modifier.horizontalScroll(rememberScrollState()),
        horizontalArrangement = Arrangement.spacedBy(AntaraTheme.spacing.sm),
    ) {
        labels.forEachIndexed { index, label ->
            val isSelected = index == selectedIndex
            Text(
                text = label,
                style = AntaraTheme.typography.labelLarge,
                color = if (isSelected) {
                    AntaraTheme.colorScheme.onPrimary
                } else {
                    AntaraTheme.extendedColors.textSecondary
                },
                modifier = Modifier
                    .heightIn(min = 40.dp)
                    .clip(RoundedCornerShape(50))
                    .background(
                        if (isSelected) {
                            AntaraTheme.colorScheme.primary
                        } else {
                            AntaraTheme.extendedColors.surfaceElevated
                        },
                    )
                    .semantics { selected = isSelected }
                    .clickable(role = Role.RadioButton) { onSelect(index) }
                    .padding(horizontal = AntaraTheme.spacing.lg, vertical = AntaraTheme.spacing.sm),
            )
        }
    }
}
