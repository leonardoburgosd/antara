# Diseño responsivo (Responsive Design)

Principios para adaptar las interfaces a dimensiones, resoluciones, densidades y características de cada dispositivo. **No se fuerza una interfaz de escritorio en una pantalla móvil ni al revés**: se mantiene la identidad del [design-system.md](design-system.md) y se adapta la distribución.

## Principios generales

1. **Contenido primero**: la jerarquía de información no cambia entre tamaños; cambia su disposición.
2. **Fluido antes que roto**: usar anchos relativos, grids flexibles y `min/max` antes que fijos.
3. **Regiones, no solo breakpoints**: Desktop se diseña por regiones de ventana redimensionable; Web por breakpoints de navegador; Mobile por tamaño de pantalla, densidad y orientación.
4. **Áreas seguras**: respetar insets del sistema (notch, barra de navegación, gestos) en Mobile; nunca colocar controles bajo elementos del SO.
5. **Controles táctiles**: mínimo 48×48dp en Mobile; 40×40px en Web/Desktop con puntero.
6. **Accesibilidad**: soportar zoom de texto hasta 200% sin perder contenido; foco visible en navegación por teclado; contraste por tokens.
7. **Zoom y densidad**: no bloquear el zoom del usuario (`user-scalable`); los diseños se prueban al menos a 100%, 125% y 150% de escala en Desktop.

## Desktop — ventanas redimensionables (Windows)

La ventana de Desktop **no** tiene tamaños fijos: el usuario redimensiona libremente (mínimo recomendado 900×600 px; configurable en `tauri.conf.json`). El layout se adapta por **regiones**:

| Región | Ancho | Comportamiento |
|---|---|---|
| **Compacta** | `< 900px` | Sidebar contraída a iconos (72px) o como overlay; sin panel lateral auxiliar; grid de biblioteca 2-3 columnas; reproductor en modo compacto |
| **Cómoda** | `900px – 1599px` | Sidebar expandida (240px); grid 4-6 columnas; panel de detalle sin abrir |
| **Amplia** | `≥ 1600px` | Sidebar 240px + panel auxiliar (cola/detalle) a la derecha; grid 6-8 columnas; mayor densidad de información |

Reglas Desktop:

- **Sidebar expandible/contraíble**: toggle manual persistido + colapso automático en región compacta. Los iconos siempre visibles; labels al expander.
- **Paneles laterales** (detalle de álbum, cola): en región compacta se abren como panel superpuesto o vista completa, no como columnas estrechas.
- **Cuadrículas de contenido**: columnas calculadas con `minmax(min-content, 1fr)`; ancho mínimo de tarjeta ~160px.
- **Reproductor persistente**: barra inferior siempre visible (no depende del scroll); su altura (80px) resta espacio al área con scroll (usar `padding-bottom`).
- **Menús contextuales**: se abren junto al cursor y se reposicionan si salen de la ventana; nunca requieren scroll para sus 2-3 primeras acciones.
- **Distribución horizontal**: explotar el ancho con paneles (lista + detalle), no estirar filas de una sola columna a 1600px.
- **Redimensionar no rompe**: sin desbordes horizontales; el grid reflowea; verificar a los tres tamaños de región.

## Web — navegador

- **Layout adaptable** con los breakpoints estándar de Tailwind: `sm 640px`, `md 768px`, `lg 1024px`, `xl 1280px`, `2xl 1536px`.
- **Navegación**: sidebar en `lg+`; en `md-lg` sidebar overlay con botón hamburguesa; en `< md` Bottom Navigation (misma que Mobile) para conservar la paridad de destinos.
- **Cuadrículas responsivas**: `grid-cols-2 → 3 → 4 → 5 → 6` según breakpoint para biblioteca.
- **Reproductor**: barra inferior persistente en todos los tamaños; en `< md` pasa a mini player + vista completa (como Mobile).
- **Ventanas pequeñas** (< 640px): columna única, densidad de Mobile, targets táctiles aunque el navegador corra en escritorio (puede haber pantalla táctil).
- **Sin scroll horizontal** en ningún breakpoint; probar con ventanas de 320px de ancho.

## Mobile — Android (teléfonos y tablets)

- **Navegación inferior** (Bottom Navigation) en teléfonos; en tablets (`≥ 600dp`) evaluar Navigation Rail a la izquierda (misma identidad de items). Nunca sidebar de escritorio.
- **Contenido vertical**: listas y grids con scroll vertical; nada depende de hover.
- **Grids**: teléfono 2 columnas (portadas pequeñas), teléfono grande 3, tablet 4-5; filas de canciones a ancho completo.
- **Reproductor compacto** (Mini Player) sobre la Bottom Navigation; **Full Screen Player** como pantalla con portada grande, controles centrales y seek accesible táctil (zona de seek ≥ 24dp).
- **Paneles y diálogos**: Bottom Sheets para menús y selecciones; diálogos centrados para confirmaciones; acciones destructivas con confirmación explícita.
- **Orientación vertical y horizontal**:
  - Vertical: patrón principal (lista, grid 2-3 col).
  - Horizontal (teléfono): grids con más columnas; Full Screen Player en dos columnas (portada izquierda, controles derecha); Bottom Navigation se mantiene.
  - Ninguna pantalla debe bloquear la rotación salvo decisión documentada (reproductor a pantalla completa puede ofrecer ambos modos).
- **Densidades de pantalla**: usar `dp`/`sp` exclusivamente (nunca px); imágenes con recursos por densidad o escalado vectorial; verificar en `mdpi`–`xxxhdpi` (equivalente a 1x–4x).
- **Áreas seguras**: edge-to-edge activo; aplicar `WindowInsets` (statusBars, navigationBars, displayCutout, ime) a las superficies que lo necesiten; la Bottom Navigation y el Mini Player se reposicionan sobre `navigationBars`.
- **Teclados virtuales**: la pantalla de búsqueda/ajustes debe scrollear o ajustar el contenido con el IME ( insets de teclado); los inputs no quedan tapados.
- **Navegación por gestos**: soportar back de Android (navegación por pila, cerrar sheets/menus primero); no crear botones físicos propios.
- **Controles táctiles**: targets ≥ 48dp, separación ≥ 8dp entre acciones contiguas, sin hover como única señal de estado.

## Superficie mínima y densidad

| Elemento | Desktop/Web (preciso) | Mobile (táctil) |
|---|---|---|
| Target de interacción mínimo | 40×40px | 48×48dp |
| Altura de fila de menú | 36px | 48dp |
| Altura de fila de canción | 56px | 64dp |
| Separación mínima entre acciones | 4dp | 8dp |
| Icono default | 24px | 24dp (28dp en acciones principales) |

## Adaptaciones obligatorias por elemento

| Elemento | Desktop | Web | Mobile |
|---|---|---|---|
| Navegación | Sidebar | Sidebar / overlay / Bottom Nav según breakpoint | Bottom Navigation |
| Biblioteca | Grid adaptable por región | Grid adaptable por breakpoint | Grid compacto (2-3 col) |
| Reproductor | Barra inferior 80px | Barra inferior (mini < md) | Mini Player 64dp |
| Reproducción completa | Panel derecho o vista completa | Panel/vista completa | Full Screen Player |
| Menú contextual | Menú junto al cursor | Menú (hover) / sheet en touch | Bottom Sheet |
| Búsqueda | Barra superior o panel | Barra superior | Pantalla dedicada con campo fijo |
| Detalle de álbum | Panel/lado derecho | Vista independiente | Navegación por pila (pantalla nueva) |
| Confirmaciones | Diálogo centrado | Diálogo centrado | Diálogo o Bottom Sheet |

## Verificación

Antes de dar por terminada una funcionalidad con UI:

1. Desktop: probar las tres regiones (compacta, cómoda, amplia) redimensionando en vivo.
2. Web: probar 320px, 640px, 768px, 1024px, 1280px, 1536px.
3. Mobile: teléfono vertical/horizontal y un tablet; con gestos y con 3 botones; con teclado virtual abierto.
4. Zoom de texto 200% sin cortes.
5. Nada de contenido debajo de insets del sistema.

Relacionado: [ui-consistency.md](ui-consistency.md), [design-system.md](design-system.md).
