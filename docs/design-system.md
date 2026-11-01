# Sistema de diseño (Design System)

**Fuente única de verdad visual** para Desktop, Mobile y Web. Las tres aplicaciones deben parecer adaptaciones del mismo producto: misma paleta, tipografía, iconografía, componentes y animaciones; distribuciones distintas según el dispositivo.

> Regla: **ninguna aplicación define colores, tipografías o tamaños arbitrarios**. Todo valor visual se toma de estos tokens. Ver también [ui-consistency.md](ui-consistency.md) y [responsive-design.md](responsive-design.md).

## Tokens de color

Paleta oscura por defecto (producto de música, uso predominantemente en ambientes oscuros) + tema claro completo. **No usar negro puro (`#000000`) ni blanco puro (`#FFFFFF`) como colores predominantes** de fondo/texto; reservar blanco puro solo para texto sobre primario y negro puro solo para superposiciones.

### Tema oscuro (predeterminado)

| Token | Valor | Uso |
|---|---|---|
| `background` | `#0D0D12` | Fondo general de la aplicación |
| `surface` | `#15151C` | Superficies: sidebar, barras, listas |
| `surface-elevated` | `#1E1E27` | Superficies elevadas: menús, modales, tarjetas hover |
| `primary` | `#8B3BFF` | Color de marca: acciones primarias, selección, foco (derivado del morado de la marca `#863bff`) |
| `primary-hover` | `#9D5CFF` | Hover/press del primario |
| `primary-subtle` | `rgba(139, 59, 255, 0.14)` | Fondos de items seleccionados, badges |
| `secondary` | `#C4B5FD` | Apoyo: texto sobre primario, indicadores secundarios |
| `accent` | `#2DD4BF` | Énfasis funcional: barra de progreso activa, ecualizador, "reproduciendo ahora" |
| `text-primary` | `#F4F4F6` | Texto principal |
| `text-secondary` | `#A3A3B2` | Texto secundario (artista, descripciones) |
| `text-disabled` | `#5C5C6B` | Texto deshabilitado |
| `border` | `#2A2A36` | Bordes y separadores |
| `border-strong` | `#3A3A48` | Bordes destacados, inputs |
| `success` | `#22C55E` | Operaciones exitosas |
| `warning` | `#F59E0B` | Advertencias (offline, buffer largo) |
| `error` | `#EF4444` | Errores, acciones destructivas |
| `overlay` | `rgba(0, 0, 0, 0.6)` | Backdrops de modal/menú |

### Tema claro

| Token | Valor |
|---|---|
| `background` | `#F6F6F9` |
| `surface` | `#FFFFFF` |
| `surface-elevated` | `#FFFFFF` |
| `primary` | `#7A2BF0` |
| `primary-hover` | `#6C22D9` |
| `primary-subtle` | `rgba(122, 43, 240, 0.10)` |
| `secondary` | `#7C3AED` |
| `accent` | `#0D9488` |
| `text-primary` | `#16161D` |
| `text-secondary` | `#5A5A66` |
| `text-disabled` | `#9A9AA6` |
| `border` | `#E5E5EC` |
| `border-strong` | `#D0D0DA` |
| `success` | `#16A34A` |
| `warning` | `#D97706` |
| `error` | `#DC2626` |
| `overlay` | `rgba(15, 15, 20, 0.5)` |

### Implementación de tokens por plataforma

| Plataforma | Mecanismo |
|---|---|
| Web / Desktop | CSS variables en el `index.css` raíz de `src/` (Web hoy: `apps/web/src/index.css`; Desktop: crear `src/styles/index.css` al implementar tokens) + bloque `@theme` de Tailwind v4 para exponer utilidades (`bg-surface`, `text-secondary`, `border`, etc.). Ejemplo: `--color-surface: #15151C;` → clase `bg-surface` |
| Mobile | Objeto de tokens en Kotlin (`core/designsystem/color/AntaraColors.kt`) traducido a `ColorScheme` de Material 3 en `AntaraTheme` |

El cambio de un token se hace **en un solo lugar por plataforma** y se propaga. Los valores literales de la tabla no se escriben en componentes.

## Tipografía

- **Familia:** Inter (**objetivo en las tres plataformas; aún no está cargada en ninguna**: sin archivos de fuente en el repo ni `@import`/`<link>` — añadir al implementar el tema). Fallback actual: `system-ui, "Segoe UI", Roboto, sans-serif`. Monoespaciada para datos técnicos: `ui-monospace, Consolas, monospace`.
- **Pesos:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold). No usar 300 ni 900.

### Escala (Desktop/Web en px; Mobile en sp con los valores Mobile)

| Estilo | Desktop/Web | Mobile | Peso | Interlínea |
|---|---|---|---|---|
| display | 40 | 34 | 700 | 1.10 |
| h1 | 32 | 28 | 700 | 1.15 |
| h2 | 24 | 22 | 600 | 1.25 |
| h3 | 18 | 18 | 600 | 1.35 |
| body-lg | 16 | 16 | 400 | 1.50 |
| body | 14 | 15 | 400 | 1.50 |
| body-sm | 13 | 14 | 400 | 1.45 |
| caption | 12 | 12 | 400 | 1.40 |
| overline | 11 | 11 | 600 | 1.40 · `letter-spacing: 0.6px` · mayúsculas |
| button | 14 | 16 | 600 | 1.00 |

### Jerarquía

- **Encabezados de página**: h1 + opcional overline encima (ej. `BIBLIOTECA` sobre `Tu música`).
- **Encabezados de sección**: h2 con acción a la derecha ("Ver todo").
- **Títulos de tarjeta/fila**: body-lg/body semibold en `text-primary`.
- **Textos secundarios**: body-sm/caption en `text-secondary`. Nunca menos de 12px.
- **Nunca** se usa color de marca (`primary`) para párrafos largos; solo para enlaces cortos, estados activos y énfasis puntual.

## Componentes

Reglas visuales comunes. Las diferencias de disposición por plataforma se definen en [responsive-design.md](responsive-design.md); aquí está la **identidad**.

| Componente | Reglas |
|---|---|
| **Botones** | Altura 40px (Desktop/Web) / 48dp (Mobile); radio `md` (10px); padding-x 16px; tipografía `button`. Variantes: `primary` (fondo `primary`, texto blanco), `secondary` (fondo `surface-elevated`, borde `border`, texto `text-primary`), `ghost` (sin fondo, texto `text-secondary` → `text-primary` en hover), `danger` (fondo `error`). Estados: hover (oscurecer 8%), pressed (escalar 0.98 o oscurecer 12%), disabled (`text-disabled`, sin interacción), focus-visible (anillo 2px `primary`, offset 2px) |
| **Inputs** | Altura 40/48; fondo `surface-elevated`; borde 1px `border-strong`; radio `md`; focus: borde `primary` + anillo sutil `primary-subtle`; placeholder `text-disabled`; error: borde `error` + mensaje caption `error` debajo |
| **Selectores** | Mismo alto que inputs; menú emergente = spec de menú; selección actual marcada con `primary-subtle` + check `primary` |
| **Tarjetas genéricas** | Fondo `surface-elevated`, radio `lg` (14px), borde 1px `border`, sin sombra salvo elevación de interacción (`shadow-md` en hover) |
| **Portadas de álbumes** | Relación **1:1**, radio `md`, `object-fit: cover`, sombra `shadow-sm` bajo la imagen; hover (preciso): ligero zoom (scale 1.03) + overlay con botón play circular `primary` centrado; placeholder mientras carga: `surface` con icono `album` |
| **Tarjetas de artista** | Avatar circular 1:1 (radio `full`), nombre body semibold centrado, subtítulo caption `text-secondary`; sin borde |
| **Filas de canciones** | Altura 56 (lista densa) / 64 (con portada 40px); grid: portada 40×40 `md` + título/artista + duración a la derecha; hover: fondo `surface-elevated`; estado reproduciendo: título en `primary` + icono de ecualizador `accent`; número de pista visible en listas numeradas |
| **Menús** | Fondo `surface-elevated`, radio `md`, `shadow-md`, borde `border`; items de altura 36 (Desktop) / 48 (Mobile); padding-x 12; hover `primary-subtle`; separadores 1px `border`; shortcut a la derecha en caption `text-secondary` |
| **Sidebar** (Desktop/Web) | Ancho 240px expandido / 72px contraída; fondo `surface`; borde derecho `border`; secciones con overline; item activo: fondo `primary-subtle`, texto `primary`, indicador izquierdo 3px `primary` |
| **Bottom Navigation** (Mobile) | Altura 56 + insets del sistema; fondo `surface` con borde superior `border`; 4-5 destinos; icono 24 + label 11px; activo: icono relleno + color `primary`; inactivo `text-secondary` |
| **Modales / Diálogos** | Backdrop `overlay`; panel `surface-elevated`, radio `lg`, `shadow-lg`, padding 24, ancho máximo 480px (Desktop/Web) / `fillMaxWidth` con margin 24 (Mobile); título h3 + acciones a la derecha (Mobile: apiladas y full-width) |
| **Bottom Sheet** (Mobile) | Alternativa móvil a menús contextuales: arrastra desde abajo, fondo `surface-elevated`, radio superior `xl`, handle 36×4 `border-strong`, backdrop `overlay` |
| **Toasts** | Fondo `surface-elevated`, borde `border`, radio `md`, `shadow-md`, ícono semántico (`success`/`error`/`warning`); duración 4s (errores persistentes con acción "Cerrar"); posición: inferior-derecha (Desktop/Web), superior (Mobile, para no chocar con mini player); **nunca** mostrar errores técnicos internos (ver [error-handling.md](error-handling.md)) |
| **Tooltips** | Solo Desktop/Web (precisión de puntero): fondo `surface-elevated`, caption, radio `sm`, `shadow-md`, delay 400ms, ocultos en touch |
| **Reproductor musical** | Barra inferior persistente (Desktop/Web, alto 80) / Mini Player (Mobile, alto 64 sobre la Bottom Nav): portada 56, título/artista, controles centrados (prev · play/pause · next), barra de progreso `accent`/`border`, volumen (Desktop/Web), acción de cola |
| **Controles de reproducción** | Iconos Material Symbols; play/pause circular 40px (48dp Mobile) con `primary` de fondo en el estado principal; prev/next ghost; shuffle/repeat: `text-secondary` → `primary` activo (repeat-one con badge) |
| **Barras de progreso** | Track 4px radio `full` en `border`; progreso en `accent` (o `primary` cuando esté en foco); buffered en `border-strong`; thumb 12px visible en hover/focus; en Mobile, zona táctil ≥ 24dp de alto aunque el track sea 4px |
| **Listas de reproducción** | Mismas filas de canciones + índice + acción de arrastre (Mobile: mantener presionado; Desktop: hover) |
| **Estados vacíos** | Centrados: icono grande `text-disabled` (48-64), título h3, descripción body `text-secondary`, acción primaria opcional; ejemplos: "Tu biblioteca está vacía", "No encontramos resultados" |
| **Skeletons** | Sustituyen el contenido mientras carga: rectángulos con radio `md` que replican la forma final (portada cuadrada, líneas de texto), shimmer 1.2s sobre `surface-elevated`; **no** usar spinners centrados para cargas de listas completas |
| **Indicadores de carga** | Spinner 24px (`accent`) para acciones puntuales; barra indeterminada para streaming/carga de página; skeleton para contenido |

## Iconografía

- **Un solo set: Material Symbols** (variante *Outlined*, peso 400, grade 0, optical size 24) en **las tres plataformas**. No mezclar con Lucide, Feather, Font Awesome ni drawables propios.
- Tamaños: 16 (inline en texto), 20 (controles pequeños), 24 (default), 28-32 (acciones destacadas), 48-64 (estados vacíos).
- Iconos decorativos: `aria-hidden` / `contentDescription = null`; iconos con acción: siempre etiqueta accesible (ver [coding-standards.md](coding-standards.md#react)).
- Set mínimo requerido: play, pause, skip_next, skip_previous, shuffle, repeat, repeat_one, queue_music, search, favorite(_border), album, artist, library_music, playlist_add, settings, close, more_vert, chevron_left/right, person, logout, volume_up/down, download, home.
- El sprite `apps/web/public/icons.svg` actual (redes sociales) **no** pertenece al design system: no usarlo para iconos de producto.

## Animaciones

### Valores

| Token | Valor | Uso |
|---|---|---|
| `duration-instant` | 100ms | Estados de presión/hover |
| `duration-fast` | 150ms | Tooltips, toggles, opacidad |
| `duration-base` | 200ms | Menús, dropdowns, hover de tarjetas |
| `duration-slow` | 300ms | Modales, sheets, entrada de paneles |
| `duration-page` | 400ms | Transiciones de pantalla |
| `easing-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Uso general (equivalente a Material *emphasized*) |
| `easing-decelerate` | `cubic-bezier(0, 0, 0, 1)` | Entradas |
| `easing-accelerate` | `cubic-bezier(0.3, 0, 1, 1)` | Salidas |
| `stagger` | 30-50ms | Listas (máx. 10 elementos encadenados) |

### Reglas

- **Hover/focus**: transiciones de 150-200ms sobre `transform` y `opacity` (nunca sobre `width`/`top`).
- **Entrada/salida de componentes**: fade + desplazamiento pequeño (8-16px) con `easing-decelerate`/`easing-accelerate`.
- **Apertura de modales**: backdrop fade + panel fade+scale(0.96→1) o slide-up, `duration-slow`; cierre inverso.
- **Cambio de pantallas**: fade + 8px de desplazamiento, `duration-page`; en Mobile puede usar slide horizontal para navegación por pila.
- **Estados de carga**: shimmer de skeleton (1.2s lineal, loop); spinners lineales; nada de parpadeos.
- **Rendimiento**: animar solo `transform`/`opacity`; sin loops infinitos en elementos grandes; máximo un loop decorativo visible a la vez (p. ej. ecualizador en la fila activa).
- **Accesibilidad**: si `prefers-reduced-motion` está activado (o el ajuste de accesibilidad equivalente en Android), se desactivan animaciones decorativas y las transiciones de página se reducen a fade instantáneo.

### Equivalencias Motion ↔ Jetpack Compose

| Motion (framer-motion) | Jetpack Compose |
|---|---|
| `<motion.div animate={{opacity:1, y:0}} initial={{opacity:0, y:16}} transition={{duration:0.3, ease}}>` | `AnimatedVisibility(visible, enter = fadeIn() + slideInVertically(initialOffsetY = { it/2 }))` |
| `AnimatePresence` (salida animada) | `AnimatedVisibility(exit = fadeOut() + slideOutVertically())` o `AnimatedContent` |
| `transition={{duration: 0.2, ease: "easeOut"}}` | `tween(durationMillis = 200, easing = FastOutSlowInEasing)` (o `EaseOut` para salida) |
| `variants` + `staggerChildren` | `LaunchedEffect(list) { delay(...); animar }` o `animateItem()` en `LazyColumn` |
| `layout` animations (reordenar) | `Modifier.animateItem()` en `LazyColumn`/`LazyGrid` |
| `whileHover` / `whileTap` | `Modifier.hoverable(interactionSource)` / `Modifier.clickable(indication = ripple())` |
| `useReducedMotion` | Comprobar `LocalAccessibilityManager` / ajustes del sistema; desactivar animaciones decorativas |
| `spring` | `spring(dampingRatio = Spring.DampingRatioMediumBouncy, stiffness = Spring.StiffnessLow)` |
| Loop infinito (ecualizador) | `rememberInfiniteTransition` con `tween(..., RepeatMode.Restart)` |
| `layoutId`/compartición de elemento | `Modifier.sharedBounds`/`SharedTransitionLayout` (solo si se adopta; no obligatorio) |

## Cómo consumir estos tokens

1. **Antes de crear un componente**, buscar si ya existe en `components/` (React) o `core/designsystem/` (Compose).
2. Todo valor de color/tipografía/radio/sombra sale de un token; si falta un token, **agregarlo aquí primero** y luego implementarlo.
3. Los componentes nuevos que introduzcan un patrón visual repetido deben documentarse aquí (tabla del componente).
4. Revisar [ui-consistency.md](ui-consistency.md) antes de cerrar cualquier funcionalidad visual.
