package com.antara.app.navigation

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.antara.app.R
import com.antara.app.core.designsystem.AntaraTheme
import com.antara.app.core.designsystem.spacing.AntaraSpacing
import com.antara.app.features.home.ui.DetailScreen
import com.antara.app.features.home.ui.HomeScreen

/**
 * Raíz de la app: estado de pestañas (3), estado de detalle (Liked Songs / álbum),
 * Scaffold con bottom nav y cambio de pantalla.
 * Sin librería de navegación (destinos estáticos; YAGNI/KISS — evaluar al crecer).
 */
@Composable
fun AppRoot() {
    // Índice de pestaña como Int para rememberSaveable; se deriva el enum para usarlo.
    var selectedTabIndex by rememberSaveable { mutableIntStateOf(Tab.Home.ordinal) }
    val selectedTab = Tab.entries[selectedTabIndex]
    // Ruta del detalle abierto (vacío = sin detalle). Ver [Routes].
    var detailRoute by rememberSaveable { mutableStateOf("") }

    // Botón "atrás" de Android: cierra el detalle si está abierto.
    BackHandler(enabled = detailRoute.isNotEmpty()) {
        detailRoute = ""
    }

    Scaffold(
        bottomBar = {
            AntaraBottomNav(
                selectedTab = selectedTab,
                onSelect = { tab ->
                    selectedTabIndex = tab.ordinal
                    detailRoute = "" // cambiar de pestaña cierra el detalle
                },
            )
        },
        containerColor = AntaraTheme.colorScheme.background,
    ) { innerPadding ->
        Box {
            // Home se mantiene compuesto para preservar su estado (filtro/scroll)
            // mientras el detalle se muestra encima.
            when (selectedTab) {
                Tab.Home -> HomeScreen(
                    modifier = Modifier.padding(innerPadding),
                    onOpenLikedSongs = { detailRoute = Routes.LIKED },
                    onOpenAlbum = { id -> detailRoute = Routes.album(id) },
                )
                Tab.Search -> PlaceholderScreen(
                    title = stringResource(R.string.nav_search),
                    modifier = Modifier.padding(innerPadding),
                )
                Tab.Library -> PlaceholderScreen(
                    title = stringResource(R.string.nav_library),
                    modifier = Modifier.padding(innerPadding),
                )
            }
            // Detalle sobre la pantalla actual (con borde inferior para no tapar la nav).
            if (detailRoute.isNotEmpty()) {
                DetailScreen(
                    route = detailRoute,
                    onBack = { detailRoute = "" },
                    onOpenLikedSongs = { detailRoute = Routes.LIKED },
                    onOpenAlbum = { id -> detailRoute = Routes.album(id) },
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(bottom = innerPadding.calculateBottomPadding()),
                )
            }
        }
    }
}

/** Pestañas de la navegación inferior. */
private enum class Tab(
    val labelRes: Int,
    val icon: ImageVector,
) {
    Home(R.string.nav_home, Icons.Filled.Home),
    Search(R.string.nav_search, Icons.Filled.Search),
    Library(R.string.nav_library, Icons.Filled.List),
}

/**
 * Menú inferior de 3 opciones (Inicio, Búsqueda, Tu biblioteca).
 * Altura 56dp + insets de navegación, fondo `surface` con borde superior `border`;
 * activo `primary`, inactivo `textSecondary`; icono 24 + label 11sp
 * (ver ui-guidelines.md → Bottom Navigation y design-system.md).
 */
@Composable
private fun AntaraBottomNav(
    selectedTab: Tab,
    onSelect: (Tab) -> Unit,
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        HorizontalDivider(
            thickness = 1.dp,
            color = AntaraTheme.extendedColors.border,
        )
        NavigationBar(
            modifier = Modifier
                .fillMaxWidth()
                .navigationBarsPadding()
                .height(56.dp),
            containerColor = AntaraTheme.colorScheme.surface,
            tonalElevation = 0.dp,
        ) {
            Tab.entries.forEach { tab ->
                val isSelected = tab == selectedTab
                NavigationBarItem(
                    selected = isSelected,
                    onClick = { onSelect(tab) },
                    icon = {
                        Icon(
                            imageVector = tab.icon,
                            contentDescription = stringResource(tab.labelRes),
                            modifier = Modifier.size(24.dp),
                        )
                    },
                    label = {
                        Text(
                            text = stringResource(tab.labelRes),
                            style = AntaraTheme.typography.labelSmall,
                        )
                    },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = AntaraTheme.colorScheme.primary,
                        selectedTextColor = AntaraTheme.colorScheme.primary,
                        unselectedIconColor = AntaraTheme.extendedColors.textSecondary,
                        unselectedTextColor = AntaraTheme.extendedColors.textSecondary,
                        indicatorColor = AntaraTheme.colorScheme.surface,
                    ),
                )
            }
        }
    }
}

/** Pantalla provisional para pestañas aún no implementadas (Búsqueda / Tu biblioteca). */
@Composable
private fun PlaceholderScreen(
    title: String,
    modifier: Modifier = Modifier,
) {
    Box(
        modifier = modifier.fillMaxSize(),
        contentAlignment = Alignment.Center,
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(AntaraSpacing.sm),
        ) {
            Text(
                text = title,
                style = AntaraTheme.typography.headlineMedium,
                color = AntaraTheme.colorScheme.onBackground,
            )
            Text(
                text = stringResource(R.string.placeholder_coming_soon),
                style = AntaraTheme.typography.bodyMedium,
                color = AntaraTheme.extendedColors.textSecondary,
            )
        }
    }
}
