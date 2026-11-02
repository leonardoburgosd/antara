# Guía de UI — Android (Jetpack Compose)

Traslado del sistema visual global ([../../docs/design-system.md](../../../docs/design-system.md)) a Jetpack Compose. La app debe verse como **parte del mismo producto** que Desktop y Web: misma paleta, tipografía, iconografía y componentes, adaptados a táctil.

> Material 3 se **personaliza** para respetar el sistema de diseño global: **nunca** se usan sus estilos por defecto ni la paleta dinámica por defecto (ADR-009 en [../../docs/decisions/README.md](../../../docs/decisions/README.md)).

## Tokens en Compose

| Token global | Implementación Compose |
|---|---|
| Colores (background, surface, primary, text-*, border, success/warning/error…) | `core/designsystem/color/AntaraColors.kt` con `Color(0xFF…)` **idénticos** a la tabla de [design-system.md](../../../docs/design-system.md#tokens-de-color), expuestos como `AntaraTheme.colorScheme` (extends `ColorScheme`) + roles adicionales (`accent`, `textSecondary`…) |
| Tipografía (Inter, escala display→caption, pesos 400/500/600/700) | `AntaraTypography.kt`: `Typography` completo con `FontFamily.SansSerif` (Inter como `FontFamily` cargado por recurso o `googleFonts` — evaluar al implementar; mientras tanto usar la familia por defecto **con la misma escala**) |
| Radii (sm 6, md 10, lg 14, xl 20, full) | `AntaraShapes.kt`: `Shapes(small/medium/large/extraLarge)` |
| Sombras | `shadow`/elevation de Compose con valores equivalentes; superficies `surface-elevated` = color + elevation 2-4dp |
| Espaciado (4/8/12/16/24/32/48/64) | `AntaraSpacing.kt` (valores `Dp`) usados como `Modifier.padding(Spacing.md)` |
| Duraciones/easings de animación | `AntaraMotion.kt`: `tween(200, easing = FastOutSlowInEasing)` etc., según la tabla de animaciones global |
| Iconografía Material Symbols | Recurso de fuente/sprite Material Symbols en `res/`; tamaños 16/20/24/28/32dp |

Reglas:

- **Prohibido** `Color.Black`/`Color.White`/colores hardcodeados fuera de `core/designsystem` (ADR-012).
- Toda pantalla usa `AntaraTheme.colorScheme/Typography/Shapes` vía `MaterialTheme`.
- Los cambios de token se hacen en `core/designsystem` y en `docs/design-system.md` (misma versión de valores).

## Equivalencias de componentes

| Global | Compose |
|---|---|
| Botones (48dp, radius md, primary/secondary/ghost/danger) | `AntaraButton` (wrapper de `Button`/`OutlinedButton`/`TextButton` con colores del tema) |
| Inputs (48dp, focus primary, error) | `AntaraTextField` (`OutlinedTextField` personalizado) |
| Tarjetas / portadas 1:1 | `AntaraCard` + `AlbumCover` (`AsyncImage` cuando exista cargador de imágenes; ratio 1:1 con `Modifier.aspectRatio(1f)`) |
| Filas de canciones (64dp) | `SongRow` (portada 40dp, título/artista, duración, estado reproduciendo en `primary` + ecualizador) |
| Menús / Bottom Sheet | `ModalBottomSheet` (Material3) con spec global (handle, radius xl, fondo `surfaceElevated`) |
| Diálogos | `AlertDialog` personalizado (fondo `surfaceElevated`, radius lg, acciones apiladas) |
| Toasts | Snackbar con el spec global (duración 4s; errores persistentes con acción) |
| Skeletons | `Modifier.shimmer`/animación de opacidad con `surfaceElevated` (1.2s) |
| Estados vacíos | `EmptyState(icon, title, description, action)` centrado |
| Bottom Navigation | Barra flotante tipo píldora (64dp, `surfaceElevated` + borde, 16dp de margen); solo iconos 24dp; activo = círculo 64dp `navIndicator` elevado 4dp con icono `background`, inactivo `onSurface` |
| Mini Player / Full Screen Player | Ver [ui-consistency](../../../docs/ui-consistency.md) y [responsive-design](../../../docs/responsive-design.md): MiniPlayer 64dp sobre la nav; FullScreenPlayer con portada grande + controles |
| Barras de progreso | `Slider`/`LinearProgressIndicator` con colores `accent`/`border` y track 4dp |

## Material You / colores dinámicos

- **`dynamicColor = false` por defecto** (consistencia de marca). La plantilla actual lo tiene en `true`: cambiar al personalizar el tema.
- Opción futura "usar colores del sistema" en Ajustes (si se ofrece): aplicar `dynamicColorScheme(context)` **solo** si el usuario la activa, y documentarlo aquí + ADR.

## Edge-to-edge, insets y navegación por gestos

- `enableEdgeToEdge()` ya presente en `MainActivity`: mantenerlo.
- Aplicar `WindowInsets` por superficie:
  - Pantallas con lista: `Modifier.windowInsetsPadding(WindowInsets.statusBars)` en top bars; `navigationBars` en bottom content.
  - Bottom Navigation y Mini Player: `windowInsetsPadding(WindowInsets.navigationBars)` (o `navigationBarsPadding()`).
  - Full Screen Player: `systemBarsPadding` + respetar `displayCutout` en horizontal.
  - Búsqueda: `imePadding()` para que el teclado virtual no tape el campo.
- La navegación por gestos (barra lateral inferior) no debe solaparse con acciones: usar insets, no offsets manuales.
- Soportar back de Android: cerrar sheet/menú → volver en la pila → (opcional) salir con confirmación si aplica.

## Densidades y orientación

- Solo `dp` para layout y `sp` para texto (nunca px): la escala funciona en mdpi–xxxhdpi y con zoom de fuente.
- **Rotación:** soportar vertical y horizontal sin bloquear; en horizontal (teléfono): grids con más columnas, Full Screen Player en dos columnas, listas mantienen densidad.
- Tablets (`≥600dp`): grids de 4-5 columnas; evaluar Navigation Rail (misma identidad de items); diálogos de ancho máximo 480dp.
- Nunca duplicar Activity por orientación; el estado vive en ViewModel/`rememberSaveable`.

## Accesibilidad

- Targets táctiles ≥ 48dp (icon-only buttons con `Modifier.size(48.dp)` de área aunque el icono sea 24dp).
- `contentDescription` en todo icono con acción; decorativos con `null`.
- Contraste según tokens (texto secundario `text-secondary` sobre `surface`/`background`).
- Tamaño de fuente escalable (sp) hasta 200% sin romper layouts: evitar alturas fijas en textos.
- Soporte TalkBack: orden de foco lógico; sin acciones que solo funcionen por gesto sin alternativa.
- Animaciones: respetar ajuste de accesibilidad del sistema (desactivar decorativas).

## Consistencia con Desktop/Web

- Mismos tokens y componentes equivalentes; mismos textos y estados (ver [../../docs/ui-consistency.md](../../../docs/ui-consistency.md)).
- Diferencias permitidas: patrones de navegación táctil (bottom nav, sheets), densidad táctil, Full Screen Player.
- Diferencias **no** permitidas: otra paleta, otro set de iconos, otro estilo de tarjetas o de reproductor.
- Antes de cerrar pantalla: checklist de consistencia en [ui-consistency.md](../../../docs/ui-consistency.md#cómo-revisar-consistencia).
