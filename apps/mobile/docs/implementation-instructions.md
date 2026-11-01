# Instrucciones de implementación — Android

> **Guía operativa obligatoria** para cualquier agente o desarrollador que implemente funcionalidades en `apps/mobile/`. Complementa —no sustituye— a la global: [`../../docs/implementation-instructions.md`](../../../docs/implementation-instructions.md).

## Documentos que SIEMPRE se consultan

1. [`../../docs/implementation-instructions.md`](../../../docs/implementation-instructions.md)
2. [`../../docs/design-system.md`](../../../docs/design-system.md)
3. [`../../docs/architecture-principles.md`](../../../docs/architecture-principles.md)
4. [`architecture.md`](architecture.md)
5. [`project-structure.md`](project-structure.md)
6. [`coding-standards.md`](coding-standards.md)
7. [`ui-guidelines.md`](ui-guidelines.md)

## Documentos de consulta condicional

| Situación | Documento obligatorio |
|---|---|
| Reproducción o ejecución en segundo plano | [`background-playback.md`](background-playback.md) |
| Controles multimedia del sistema / notificación / lock screen | [`media-session.md`](media-session.md) |
| Permisos, servicios o ciclo de vida | [`permissions-and-lifecycle.md`](permissions-and-lifecycle.md) |
| Pruebas | [`testing.md`](testing.md) |
| Consumo de API | [`../../docs/api-integration.md`](../../../docs/api-integration.md) |
| Errores | [`../../docs/error-handling.md`](../../../docs/error-handling.md) |
| Seguridad (tokens, backups, permisos) | [`../../docs/security.md`](../../../docs/security.md) |
| Responsivo / orientación / insets | [`../../docs/responsive-design.md`](../../../docs/responsive-design.md) |
| Consistencia con Desktop/Web | [`../../docs/ui-consistency.md`](../../../docs/ui-consistency.md) |
| Decisiones previas (DI, Material 3, Media3…) | [`../../docs/decisions/README.md`](../../../docs/decisions/README.md) |

## Procedimiento

Seguir los 7 pasos de [`../../docs/implementation-instructions.md`](../../../docs/implementation-instructions.md) aplicados a Android:

**Paso 3 (diseño) — preguntas específicas de Android:**

- [ ] ¿La pantalla tiene su ViewModel + `UiState`, sin lógica en composables?
- [ ] ¿Las dependencias nuevas son justificadas y registradas (ADR)? (no agregar libs "por si acaso")
- [ ] ¿Los datos pasan por `domain`/`data` según [architecture.md](architecture.md)?
- [ ] Si toca reproducción: ¿leí `background-playback.md` completo? ¿La UI sigue usando `MediaController` y no un `ExoPlayer` propio?
- [ ] Si toca notificación/controles del sistema: ¿leí `media-session.md`?
- [ ] Si toca permisos/servicio/manifest: ¿leí `permissions-and-lifecycle.md` y verifiqué API 33/34?
- [ ] ¿La UI usa `AntaraTheme` con tokens globales (sin colores/estilos hardcodeados)?
- [ ] ¿Se contemplaron insets, orientación, targets de 48dp y TalkBack?

**Paso 5 (pruebas):** aplicar [testing.md](testing.md); si se toca reproducción o segundo plano, ejecutar el checklist manual de [background-playback.md](background-playback.md#checklist-de-implementación).

**Paso 6 (documentación):** actualizar este directorio si cambian arquitectura, reproducción, permisos o convenciones; registrar decisiones en [`../../docs/decisions/README.md`](../../../docs/decisions/README.md).

## Reglas inamovibles de Android

1. **Ninguna funcionalidad nueva puede comprometer la reproducción en segundo plano ni la sincronización con MediaSession** — [background-playback.md](background-playback.md), [media-session.md](media-session.md).
2. **Sin segundo reproductor:** `ExoPlayer` solo dentro de `PlaybackService`; la UI observa vía `MediaController` (fuente única de estado, ADR-011).
3. **Permisos mínimos** y justificados; nada de permisos "por si acaso" — [permissions-and-lifecycle.md](permissions-and-lifecycle.md).
4. **Material 3 personalizado** con los tokens globales; `dynamicColor` off por defecto — [ui-guidelines.md](ui-guidelines.md).
5. **Sin lógica de negocio en composables** ni HTTP fuera de `core/network`.
6. **No inventar endpoints:** contratos del backend real — [`../../docs/api-integration.md`](../../../docs/api-integration.md).
7. **No introducir dependencias sin evaluar** (Hilt, Room, Coil, WorkManager…): justificar y registrar como ADR.
8. No eliminar funcionalidades protegidas (notificación, background playback, permisos) sin justificación y ADR.

## Regla de contradicción

Si una implementación contradice cualquier documento de este directorio o de `../../docs/`: **detenerse**, explicar la contradicción y proponer una solución antes de introducir una nueva convención (ver [`../../docs/implementation-instructions.md`](../../../docs/implementation-instructions.md#regla-de-contradicción)).
