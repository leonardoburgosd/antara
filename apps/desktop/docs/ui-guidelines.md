# Guía de UI — Desktop (Windows)

Adaptación del sistema visual global ([../../docs/design-system.md](../../../docs/design-system.md)) a Windows. La app debe verse como la versión Web del mismo producto: misma paleta, tipografía, iconografía y componentes; densidad y comportamiento propios de escritorio.

## Ventana

- **Ventana redimensionable** con tamaño mínimo razonable (recomendado 900×600 en `tauri.conf.json` `minSize`); sin tamaños fijos.
- **Barra de título y controles de ventana:** usar decoraciones nativas de Windows por defecto (decisión actual):
  - Ventajas: Snap Layouts de Windows 11, accesibilidad, arrastre, y compatibilidad sin código extra.
  - Si en el futuro se adopta título personalizado (`decorations: false` + `data-tauri-drag-region`), debe respetar este documento y registrarse como ADR.
- **Persistencia de geometría:** plugin `window-state` (tamaño, posición, maximizado) — ver [system-tray.md](system-tray.md#implementación-técnica-tauri-2).
- **Comportamiento de cierre:** X = ocultar a bandeja (Close-to-Tray), nunca terminar el proceso (ver [system-tray.md](system-tray.md)).
- Título de ventana: nombre del producto ("Antara"), no "tauri-app" (deuda ADR-012).

## Layout de escritorio

- Regiones por ancho de ventana (ver [../../docs/responsive-design.md](../../../docs/responsive-design.md#desktop--ventanas-redimensionables-windows)): sidebar 240px / iconos 72px, grid adaptable, panel auxiliar opcional.
- **Densidad de información:** escritorio permite más datos visibles (columnas extra en listas, paneles de detalle, tooltips); no "estirar" el diseño móvil.
- Barra de reproductor **persistente** abajo (80px); el área con scroll reserva su altura.
- Scroll: rueda del mouse; `shift+rueda` horizontal en listas anchas; scrollbars finos consistentes con el tema (personalizar `::-webkit-scrollbar` con tokens `border`/`surface-elevated`).

## Menús

- Menú contextual (click derecho) en filas de canciones, álbumes y áreas de biblioteca: spec de [../../docs/design-system.md](../../../docs/design-system.md#componentes) (fondo `surface-elevated`, radio `md`, items 36px, shortcuts a la derecha).
- Atajos dentro del menú mostrados como texto (p. ej. `Ctrl+K`), nunca como única vía de acceso a la acción.
- Cerrar con `Escape` o click fuera; reposicionarse si sale de la ventana.

## Atajos de teclado

Definirlos en un único módulo (`hooks/useKeyboardShortcut.ts`) y documentarlos en Ajustes > Atajos:

| Atajo | Acción |
|---|---|
| `Espacio` | Reproducir / pausar (cuando el foco no está en un input) |
| `Ctrl + K` | Buscar |
| `Ctrl + ←/→` | Pista anterior / siguiente |
| `Shift + ←/→` | Retroceder / avanzar 10 s |
| `Ctrl + ↑/↓` | Volumen ±5 % |
| `Ctrl + L` | Marcar/desmarcar favorito de la pista actual |
| `Ctrl + Q` | Mostrar/ocultar cola |
| `Escape` | Cerrar modal/menú/búsqueda |
| `F11` (evaluar) | Pantalla completa (solo si aplica) |

Reglas: no interceptar atajos del sistema de Windows; desactivar atajos de reproducción mientras hay un input enfocado; `preventDefault` solo cuando la acción se maneje.

## Hover, focus y tooltips

- **Hover:** solo con puntero fino (`@media (hover: hover)`); transiciones 150-200ms (tokens de duración).
- **Focus visible:** anillo `primary` 2px con offset 2px (`:focus-visible`), **obligatorio** en toda acción interactiva (navegación por teclado).
- **Tooltip:** al pasar 400ms, `surface-elevated` + caption; solo en controles con icono sin label; ocultos en touch (no aplica en Windows con ratón, pero el CSS debe ser defensivo).
- **Pressed:** oscurecer 12% o `scale(0.98)`; feedback inmediato en botones de reproducción.

## Drag and Drop

- **Hoy no hay D&D implementado.** Si se incorpora (arrastrar pistas a listas, o soltar archivos), debe:
  - Usar HTML5 DnD del frontend para elementos internos.
  - Para archivos externos, evaluar el mecanismo soportado por Tauri 2 (evento de ventana/handler nativo) con permiso mínimo; registrar la decisión.
  - Mostrar zonas válidas/inválidas con tokens (`primary-subtle` / `error`).
- No bloquear el D&D nativo de texto/selección en el resto de la UI.

## Escalado y DPI

- Diseñado a 100%; **probar a 125% y 150%** (común en portátiles) y a 200% (zoom del sistema).
- Usar `rem`/`px` derivados de tokens; evitar fuentes en `pt`.
- Iconos y controles no deben verse borrosos: usar SVG (Material Symbols) escalables.
- Respetar el zoom del navegador del webview (no bloquearlo).

## Consistencia con Web

- Mismos tokens y componentes equivalentes (ver [../../docs/ui-consistency.md](../../../docs/ui-consistency.md)).
- Diferencias permitidas: densidad mayor, tooltips, atajos, menús contextuales con shortcuts, sidebar fija.
- Diferencias **no** permitidas: otro set de iconos, otra paleta, otro estilo de tarjetas/reproductor.

## Accesibilidad

- Navegación completa por teclado con foco visible.
- Contraste según tokens del design system; texto mínimo 12px.
- Iconos con acción: nombre accesible (`aria-label`/tooltip visible).
- Soporte de `prefers-reduced-motion` (reglas en [../../docs/design-system.md](../../../docs/design-system.md#reglas); si se aparta de ellas, registrar la excepción en [../../docs/decisions/README.md](../../../docs/decisions/README.md)).
- Zoom de texto 200% sin pérdida de contenido.
