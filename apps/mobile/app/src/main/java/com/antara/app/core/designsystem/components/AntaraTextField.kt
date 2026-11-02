package com.antara.app.core.designsystem.components

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.input.VisualTransformation
import com.antara.app.core.designsystem.AntaraTheme

/**
 * Input del design system: superficie elevada, borde `border-strong`, foco `primary`.
 */
@Composable
fun AntaraTextField(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    modifier: Modifier = Modifier,
    leadingIcon: ImageVector? = null,
    trailingIcon: @Composable (() -> Unit)? = null,
    isError: Boolean = false,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    keyboardActions: KeyboardActions = KeyboardActions.Default,
    visualTransformation: VisualTransformation = VisualTransformation.None,
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        placeholder = {
            Text(
                text = placeholder,
                style = AntaraTheme.typography.bodyMedium,
                color = AntaraTheme.extendedColors.textDisabled,
            )
        },
        leadingIcon = leadingIcon?.let { icon ->
            {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = AntaraTheme.extendedColors.textSecondary,
                )
            }
        },
        trailingIcon = trailingIcon,
        isError = isError,
        singleLine = true,
        keyboardOptions = keyboardOptions,
        keyboardActions = keyboardActions,
        visualTransformation = visualTransformation,
        shape = AntaraTheme.shapes.medium,
        textStyle = AntaraTheme.typography.bodyLarge,
        colors = OutlinedTextFieldDefaults.colors(
            focusedTextColor = AntaraTheme.extendedColors.textPrimary,
            unfocusedTextColor = AntaraTheme.extendedColors.textPrimary,
            focusedContainerColor = AntaraTheme.extendedColors.surfaceElevated,
            unfocusedContainerColor = AntaraTheme.extendedColors.surfaceElevated,
            disabledContainerColor = AntaraTheme.extendedColors.surfaceElevated,
            cursorColor = AntaraTheme.colorScheme.primary,
            focusedBorderColor = AntaraTheme.colorScheme.primary,
            unfocusedBorderColor = AntaraTheme.extendedColors.borderStrong,
            errorBorderColor = AntaraTheme.colorScheme.error,
            focusedLeadingIconColor = AntaraTheme.colorScheme.primary,
            unfocusedLeadingIconColor = AntaraTheme.extendedColors.textSecondary,
            focusedTrailingIconColor = AntaraTheme.colorScheme.primary,
            unfocusedTrailingIconColor = AntaraTheme.extendedColors.textSecondary,
        ),
        modifier = modifier.fillMaxWidth(),
    )
}
