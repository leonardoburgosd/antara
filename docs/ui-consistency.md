# Consistencia de UI entre plataformas (UI Consistency)

Las aplicaciones deben parecer **adaptaciones del mismo producto**, no tres productos independientes. Este documento define cómo se garantiza.

## Reglas

1. **Mismos tokens visuales.** Colores, tipografía, espaciado, radios, sombras y animaciones salen de [design-system.md](design-system.md) en las tres plataformas. Ningún componente define valores propios.
2. **Identidad visual equivalente en componentes equivalentes.** Una tarjeta de álbum conserva en todas las plataformas: proporción de portada (1:1), radio de bordes, tratamiento de imagen, tipografía e información secundaria, e iconografía de interacción. La implementación interna (React/Composable) puede diferir.
3. **Estados visuales equivalentes.** Todos los componentes exponen los mismos estados: default, hover (solo puntero), pressed, focus-visible, disabled, loading, error, selected. Un estado que existe en una plataforma debe existir en las otras (adaptado a su modo de interacción).
4. **Nombres, iconos y acciones consistentes.** Mismo label para la misma acción ("Reproducir", "Añadir a la cola", "Favorito"); mismo set de iconos Material Symbols; mismos mensajes de error/éxito por condición.
5. **Las diferencias de distribución responden a las características del dispositivo**, nunca a preferencias arbitrarias (ver [responsive-design.md](responsive-design.md)).
6. **Paridad funcional**: ninguna funcionalidad desaparece porque una plataforma tenga otra interfaz (ver reglas abajo).
7. **Diferencias funcionales propias de cada sistema están documentadas** en la documentación específica de la plataforma y justificadas (p. ej. System Tray solo existe en Desktop; MediaSession solo en Android).

## Reglas de paridad funcional

- Toda funcionalidad de producto se implementa en las **tres** plataformas, salvo excepción documentada.
- La excepción debe registrarse en [`decisions/README.md`](decisions/README.md) con: plataforma, funcionalidad, motivo técnico/nativo, y condición de revisión.
- Las funcionalidades **nativas** (bandeja, MediaSession) se ofrecen como valor añadido, no como sustituto de una función de producto.
- Antes de cerrar una feature, completar la checklist de paridad: mismas acciones, mismos estados, mismos textos, mismos flujos de error.

## Tabla de equivalencias

| Elemento | Desktop | Web | Mobile |
|---|---|---|---|
| Navegación | Sidebar | Sidebar adaptable → Bottom Nav en móvil | Bottom Navigation |
| Biblioteca | Grid adaptable por región | Grid adaptable por breakpoint | Grid compacto |
| Reproductor | Barra inferior persistente | Barra inferior (mini en ventana pequeña) | Mini Player |
| Reproducción completa | Panel lateral o vista completa | Panel/vista completa | Full Screen Player |
| Menú contextual | Menú contextual (cursor) | Menú (hover) / Bottom Sheet en touch | Bottom Sheet |
| Búsqueda | Barra superior / panel | Barra superior | Pantalla de búsqueda |
| Detalle de álbum/artista | Panel de detalle | Página dedicada | Pantalla por pila |
| Confirmación | Diálogo centrado | Diálogo centrado | Diálogo / Bottom Sheet |
| Feedback (toasts) | Inferior-derecha | Inferior-derecha | Superior |
| Estados vacíos / skeletons | Centrados con tokens | Centrados con tokens | Centrados con tokens |
| Tema claro/oscuro | Según tokens + ajuste de sistema | Según `prefers-color-scheme` + ajuste | Según tema de la app (sistema opcional) |

## Fuente única de verdad visual

- Los valores visuales **no** se definen por plataforma de forma arbitraria; están en [design-system.md](design-system.md).
- React (Desktop/Web): tokens en CSS variables + `@theme` de Tailwind. Si en el futuro se crea `packages/` (ver [project-structure.md](project-structure.md#paquetes-compartidos-candidato-futuro-no-implementado)), los tokens y componentes compartidos pasarán ahí; hasta entonces, **mantener los valores idénticos en el `index.css` de cada app** (Web: `src/index.css`; Desktop: `src/styles/index.css` al crearlo) es responsabilidad del revisor.
- Android: los mismos tokens implementados en Kotlin/Compose (`core/designsystem/`), traducidos a `ColorScheme`, `Typography` y `Shapes` de Material 3 **personalizado** (nunca los valores por defecto de Material 3 ni el color dinámico por defecto, que romperían la marca; ver [`apps/mobile/docs/ui-guidelines.md`](../apps/mobile/docs/ui-guidelines.md)).
- **No se fuerza reutilización de código React en Android.** La reutilización es de *valores y reglas*, no de implementación.

## Cómo revisar consistencia

En cada PR/feature con UI:

1. ¿Todos los colores/tipografías/radios son tokens (sin literales)?
2. ¿Los estados (hover/focus/disabled/loading/error) existen en todas las plataformas afectadas?
3. ¿Los labels, iconos y mensajes coinciden entre plataformas?
4. ¿La distribución se adaptó a la plataforma con las reglas de [responsive-design.md](responsive-design.md)?
5. ¿Apareció una diferencia funcional? ¿Está documentada y justificada?

Relacionado: [design-system.md](design-system.md), [implementation-instructions.md](implementation-instructions.md).
