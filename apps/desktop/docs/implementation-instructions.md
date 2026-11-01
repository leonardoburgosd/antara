# Instrucciones de implementación — Desktop

> **Guía operativa obligatoria** para cualquier agente o desarrollador que implemente funcionalidades en `apps/desktop/`. Complementa —no sustituye— a la global: [`../../docs/implementation-instructions.md`](../../../docs/implementation-instructions.md).

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
| Ciclo de vida, ventanas, ejecución en segundo plano, bandeja | [`system-tray.md`](system-tray.md) |
| Reproducción musical, cola, streaming, formatos | [`audio-playback.md`](audio-playback.md) |
| Pruebas | [`testing.md`](testing.md) |
| Errores de red/backend | [`../../docs/error-handling.md`](../../../docs/error-handling.md) |
| Consumo de API | [`../../docs/api-integration.md`](../../../docs/api-integration.md) |
| Seguridad (CSP, capabilities, tokens) | [`../../docs/security.md`](../../../docs/security.md) |
| Responsivo/regiones de ventana | [`../../docs/responsive-design.md`](../../../docs/responsive-design.md) |
| Consistencia con Web/Mobile | [`../../docs/ui-consistency.md`](../../../docs/ui-consistency.md) |
| Decisiones previas (motor de reproducción, tray, etc.) | [`../../docs/decisions/README.md`](../../../docs/decisions/README.md) |

## Procedimiento

Seguir los 7 pasos de [`../../docs/implementation-instructions.md`](../../../docs/implementation-instructions.md) (análisis → consulta → diseño → implementación → pruebas → documentación → revisión) aplicados a Desktop:

**Paso 3 (diseño) — preguntas específicas de Desktop:**

- [ ] ¿Esta operación puede resolverse en el frontend? Si sí, **no** crear comando Tauri ([architecture.md](architecture.md)).
- [ ] Si toca cerrar/ventana/bandeja: ¿leí `system-tray.md` completo?
- [ ] Si toca audio: ¿uso el store + `PlaybackEngine` y no `HTMLAudioElement` en componentes?
- [ ] ¿Los nuevos permisos de capability son mínimos y justificados?
- [ ] ¿La UI usa tokens (sin hex literales) y respeta la densidad de escritorio ([ui-guidelines.md](ui-guidelines.md))?
- [ ] ¿Los atajos de teclado y foco visible están contemplados?

**Paso 5 (pruebas):** aplicar [testing.md](testing.md); si se toca bandeja/ciclo de vida, ejecutar el checklist manual de [system-tray.md](system-tray.md#pruebas-obligatorias).

**Paso 6 (documentación):** actualizar este directorio si cambian arquitectura, tray, motor de reproducción o convenciones; registrar decisiones en [`../../docs/decisions/README.md`](../../../docs/decisions/README.md).

## Reglas inamovibles de Desktop

1. **No eliminar ni modificar el comportamiento de System Tray / Close-to-Tray** sin justificación técnica y documentación de la decisión (ADR) — [system-tray.md](system-tray.md).
2. **No romper la reproducción con la ventana oculta**: la X oculta; solo "Salir" termina el proceso.
3. **No** implementar lógica de negocio compleja en comandos Tauri; **no** usar comandos para lo que el frontend resuelve.
4. **No** llamar `invoke`/`listen` desde componentes: pasar por `integrations/tauri/`.
5. **No** inventar endpoints: contratos del backend real ([../../docs/api-integration.md](../../../docs/api-integration.md)).
6. **No** introducir dependencias sin evaluar y registrar (Rust o npm).
7. Mantener paridad visual con Web ([../../docs/ui-consistency.md](../../../docs/ui-consistency.md)).

## Regla de contradicción

Si una implementación contradice cualquier documento de este directorio o de `../../docs/`: **detenerse**, explicar la contradicción y proponer una solución antes de introducir una nueva convención (ver [`../../docs/implementation-instructions.md`](../../../docs/implementation-instructions.md#regla-de-contradicción)).
