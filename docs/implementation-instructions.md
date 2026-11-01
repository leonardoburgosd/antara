# Instrucciones de implementación (Implementation Instructions)

> **Documento obligatorio.** Guía operativa que **todo agente de IA o desarrollador debe consultar antes de desarrollar una funcionalidad nueva**. No implementar nada sin seguir este procedimiento.

## Flujo general

El detalle completo del flujo está en [development-workflow.md](development-workflow.md). Este documento es la guía operativa resumida en 7 pasos.

---

## Paso 1. Análisis del requerimiento

- Comprender el **objetivo** y el usuario al que va dirigido.
- Identificar **plataformas afectadas**: ¿Desktop, Mobile, Web, o las tres?
- Determinar si es **global** (mismo producto en todas) o **específica** de plataforma (nativo: bandeja, MediaSession, etc.).
- Identificar **funcionalidades existentes relacionadas**: buscar en el código antes de crear algo nuevo (¿ya hay un componente/servicio/hook equivalente?).

## Paso 2. Consulta de documentación

### Obligatoria en todos los casos

| # | Documento |
|---|---|
| 1 | [global-architecture.md](global-architecture.md) |
| 2 | [architecture-principles.md](architecture-principles.md) |
| 3 | [project-structure.md](project-structure.md) |
| 4 | [coding-standards.md](coding-standards.md) |
| 5 | [design-system.md](design-system.md) |
| 6 | [api-integration.md](api-integration.md) |
| 7 | [error-handling.md](error-handling.md) |
| 8 | [testing-strategy.md](testing-strategy.md) |
| 9 | [responsive-design.md](responsive-design.md) y [ui-consistency.md](ui-consistency.md) si hay UI |

### Según plataforma

**Desktop** (`apps/desktop/`) — obligatorios:

1. [`../../docs/implementation-instructions.md`](implementation-instructions.md) (este documento)
2. [`../../docs/design-system.md`](design-system.md)
3. [`../../docs/architecture-principles.md`](architecture-principles.md)
4. [`architecture.md`](../apps/desktop/docs/architecture.md)
5. [`project-structure.md`](../apps/desktop/docs/project-structure.md)
6. [`coding-standards.md`](../apps/desktop/docs/coding-standards.md)
7. [`ui-guidelines.md`](../apps/desktop/docs/ui-guidelines.md)
8. [`system-tray.md`](../apps/desktop/docs/system-tray.md) — **cuando la funcionalidad afecte ciclo de vida, ventanas o ejecución en segundo plano**
9. [`audio-playback.md`](../apps/desktop/docs/audio-playback.md) — **cuando afecte reproducción musical**

**Mobile** (`apps/mobile/`) — obligatorios:

1. [`../../docs/implementation-instructions.md`](implementation-instructions.md) (este documento)
2. [`../../docs/design-system.md`](design-system.md)
3. [`../../docs/architecture-principles.md`](architecture-principles.md)
4. [`architecture.md`](../apps/mobile/docs/architecture.md)
5. [`project-structure.md`](../apps/mobile/docs/project-structure.md)
6. [`coding-standards.md`](../apps/mobile/docs/coding-standards.md)
7. [`ui-guidelines.md`](../apps/mobile/docs/ui-guidelines.md)
8. [`background-playback.md`](../apps/mobile/docs/background-playback.md) — **cuando afecte reproducción o segundo plano**
9. [`media-session.md`](../apps/mobile/docs/media-session.md) — **cuando afecte controles multimedia del sistema**
10. [`permissions-and-lifecycle.md`](../apps/mobile/docs/permissions-and-lifecycle.md) — **cuando afecte permisos, servicios o ciclo de vida**

**Web** (`apps/web/`): documentación global completa + revisar la estructura existente de `apps/web/` (no tiene carpeta `docs/` propia).

### Funcionalidades obligatorias

Si la funcionalidad afecta a uno de estos comportamientos, **consultar el documento especializado correspondiente antes de tocar código**:

| Funcionalidad | Documento obligatorio |
|---|---|
| Arquitectura Desktop | [`apps/desktop/docs/architecture.md`](../apps/desktop/docs/architecture.md) |
| System Tray | [`apps/desktop/docs/system-tray.md`](../apps/desktop/docs/system-tray.md) |
| Reproducción Desktop | [`apps/desktop/docs/audio-playback.md`](../apps/desktop/docs/audio-playback.md) |
| Arquitectura Android | [`apps/mobile/docs/architecture.md`](../apps/mobile/docs/architecture.md) |
| Reproducción en segundo plano | [`apps/mobile/docs/background-playback.md`](../apps/mobile/docs/background-playback.md) |
| Controles multimedia Android | [`apps/mobile/docs/media-session.md`](../apps/mobile/docs/media-session.md) |
| Permisos Android | [`apps/mobile/docs/permissions-and-lifecycle.md`](../apps/mobile/docs/permissions-and-lifecycle.md) |
| Consistencia visual | [`docs/design-system.md`](design-system.md) |
| Diseño responsivo | [`docs/responsive-design.md`](responsive-design.md) |
| Desarrollo de funcionalidades | este documento |

> **No se permite eliminar, simplificar o sustituir estas funcionalidades sin documentar el impacto y justificar técnicamente el cambio** (registrar en [`decisions/README.md`](decisions/README.md)).

## Paso 3. Diseño de la solución (antes de escribir código)

Definir y anotar:

- [ ] **Módulos a modificar/crear** (por plataforma), según [project-structure.md](project-structure.md).
- [ ] **Componentes nuevos** vs. reutilización de los existentes en el design system.
- [ ] **Servicios y dependencias**: qué servicios consumes, qué dependencias nuevas se necesitan (¿justificadas? ¿registradas?).
- [ ] **Contratos de API**: endpoints y DTOs **tomados del backend real** (nunca inventados).
- [ ] **Estados de la funcionalidad**: loading/empty/error/success; estados del reproductor si aplica.
- [ ] **Efectos secundarios**: red, permisos, ciclo de vida, eventos del sistema → cómo se contienen en la capa de infraestructura.
- [ ] **Accesibilidad**: foco, etiquetas, targets, contraste.
- [ ] **Responsive**: regiones/breakpoints/orientación afectados (ver [responsive-design.md](responsive-design.md)).
- [ ] **Impacto en otras plataformas**: si es global, ¿cómo se ve en las otras dos?

## Paso 4. Implementación

- Escribir código respetando [coding-standards.md](coding-standards.md) y los estándares específicos de plataforma.
- Usar tokens del [design-system.md](design-system.md) — sin literales de color/tipografía en componentes.
- Errores según [error-handling.md](error-handling.md); API según [api-integration.md](api-integration.md).
- **No crear estructuras alternativas sin justificación técnica.** Si la documentación no contempla un caso, documentar primero la decisión (Paso 6) o proponerla antes de codificar.

## Paso 5. Pruebas

- Ejecutar las pruebas definidas en [testing-strategy.md](testing-strategy.md) y los `testing.md` de plataforma.
- Cubrir: unidades, estados de UI (loading/empty/error), errores de red, navegación.
- **No considerar terminada una funcionalidad simplemente porque compila.**

## Paso 6. Documentación

Actualizar cuando corresponda:

- Nueva decisión estructural, dependencia o comportamiento → documentos globales o específicos afectados.
- Nueva decisión registrable → [`decisions/README.md`](decisions/README.md).
- Nueva regla visual (componente nuevo) → tabla de componentes de [design-system.md](design-system.md).
- Cambio en funcionalidad protegida → documento especializado + justificación.

## Paso 7. Revisión final

Verificar:

- [ ] **Arquitectura**: separación de capas, sin dependencias circulares, sin lógica de negocio en la UI (ver [architecture-principles.md](architecture-principles.md)).
- [ ] **Calidad del código**: estándares por lenguaje, sin código muerto, sin `any`/`!!`/`unwrap()` injustificados.
- [ ] **Seguridad**: sin secretos, tokens bien guardados, logs sin datos sensibles (ver [security.md](security.md)).
- [ ] **Rendimiento**: sin animaciones costosas, listas paginadas, sin fetch en render, sin bucles infinitos pesados.
- [ ] **Consistencia visual**: tokens, estados, textos (ver [ui-consistency.md](ui-consistency.md)).
- [ ] **Compatibilidad**: no se rompieron funcionalidades existentes (pruebas + smoke test).

---

## Regla de contradicción

> **Si una implementación contradice una instrucción documentada, el agente debe detenerse, explicar la contradicción y proponer una solución antes de introducir una nueva convención.**

Procedimiento ante una contradicción:

1. **Detenerse**: no escribir código que viole la documentación.
2. **Explicar**: citar el documento y la instrucción exacta en conflicto, y por qué el caso real no encaja.
3. **Proponer**: alternativas (cumplir la instrucción, o modificar la instrucción con justificación).
4. **Resolver**: si la solución implica cambiar la documentación, actualizarla en el mismo cambio y registrarlo en [`decisions/README.md`](decisions/README.md).
5. **Nunca** introducir una convención nueva en silencio: la documentación es la referencia oficial de todo desarrollo futuro.

## Recordatorio final

- La documentación es el **punto de referencia obligatorio** antes de implementar.
- Misma identidad visual, experiencia coherente, tres implementaciones adaptadas a sus plataformas.
- No inventar contratos; no eliminar funcionalidades protegidas; no sacrificar rendimiento ni natividad por similitud visual.
