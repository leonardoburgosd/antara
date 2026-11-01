# Principios arquitectónicos (Architecture Principles)

Principios **obligatorios** para todas las plataformas. Cualquier decisión de diseño debe poder justificarse con uno o más de estos principios; si una implementación los viola, debe justificarse explícitamente.

## Principios

### Separation of Concerns

Cada módulo, componente o capa atiende un solo tipo de responsabilidad:

- **Presentación** (componentes, pantallas, composables): renderiza y traduce interacciones en llamadas a lógica.
- **Lógica de negocio / dominio**: reglas del producto, validaciones con significado, decisiones de reproducción.
- **Datos / infraestructura**: comunicación HTTP, persistencia, integración con APIs del sistema operativo.

En Desktop, la frontera adicional es **React vs. Rust**: el frontend maneja UI y lógica de producto; Rust maneja capacidades nativas de Windows (bandeja, ventana, integración con el SO). Ver [`apps/desktop/docs/architecture.md`](../apps/desktop/docs/architecture.md).

### Single Responsibility Principle (SRP)

Una clase, módulo, composable o comando tiene **una** razón para cambiar. Señales de violación:

- Un componente que renderiza, valida, llama a la API y gestiona el estado a la vez.
- Un "utils.ts"/"helpers.kt" con más de ~200 líneas de cosas distintas.
- Un comando Tauri que hace HTTP + transforma datos + persiste.
- Un ViewModel que consulta directamente la API sin repositorio.

### Dependency Inversion

Los módulos de alto nivel no dependen de detalles concretos; dependen de abstracciones:

- La UI depende de interfaces de repositorio/servicio, no de `fetch` o de una librería HTTP concreta.
- El reproductor depende de una interfaz de motor (`PlaybackEngine`), no de `HTMLAudioElement` o `ExoPlayer` directamente.
- En Android, los ViewModels dependen de interfaces de repositorio definidas en dominio.

Esto permite sustituir implementaciones (por ejemplo, cambiar el motor de reproducción en Desktop) sin tocar la UI.

### High Cohesion / Low Coupling

- Los módulos de una misma funcionalidad viven juntos (ver [project-structure.md](project-structure.md)).
- Un módulo conoce lo mínimo posible de otros: se comunican mediante contratos (interfaces, tipos, eventos), no accediendo a sus Internos.
- Evitar "god components", "god repositories" y "god services".

### SOLID cuando corresponda

Aplicar S, O, L, I y D donde aporten claridad. **No** aplicarlos de forma ritual: una interfaz con una sola implementación y un solo consumidor rara vez justifica abstracción extra (ver YAGNI).

### DRY sin sacrificar legibilidad

- Duplicar **reglas de negocio y tokens visuales** está prohibido: se centralizan (tokens de diseño en [design-system.md](design-system.md), validaciones en una función/módulo único).
- Duplicar 3 líneas de JSX/Composable distintas entre sí **no** es duplicación a eliminar: forzar la abstracción prematura suele costar más legibilidad de la que ahorra.

### KISS

La solución más simple que cumpla el requisito, correctamente hecha. Preferir:

- Funciones planas y directas sobre jerarquías de patrones.
- Estado local antes que estado global.
- Una capa de transformación antes que cinco capas de "preparación".

### YAGNI

No construir para necesidades futuras hipotéticas. Ejemplos concretos:

- No crear capa de casos de uso si la regla de negocio es una consulta directa y no se reutiliza.
- No crear `packages/` compartidos hasta que exista duplicación real y medida (ver [project-structure.md](project-structure.md#paquetes-compartidos-candidato-futuro-no-implementado)).
- No añadir caché local antes de medir la necesidad.

> **Anti-sobrearquitectura:** Clean Architecture completa, CQRS, módulos Gradle por feature, micro-frontends y patrones similares **no se implementan por moda**. Solo se adoptan cuando existe una ventaja concreta y justificable para la escala actual del proyecto, y la decisión queda registrada en [`decisions/README.md`](decisions/README.md).

### Encapsulamiento

- Ocultar implementación tras interfaces públicas pequeñas.
- En React: no exponer el estado interno de un componente; exponer props y callbacks.
- En Rust: módulos `pub(crate)` por defecto; `pub` solo lo necesario.
- En Kotlin: `private` por defecto; exponer `Flow`/`StateFlow` inmutables.

### Modularidad

- Cada funcionalidad es un módulo con límites claros (carpeta/paquete propio).
- Los módulos se pueden entender, probar y (cuando haga falta) extraer de forma independiente.
- Las dependencias entre módulos son un grafo dirigido sin ciclos.

### Inmutabilidad cuando aporte valor

- Estado de UI modelado con valores inmutables (`UiState` data classes en Kotlin, objetos de estado en TS con actualizaciones por reemplazo, no por mutación).
- Props de React siempre inmutables; nunca mutar props ni props de contexto.
- Mutación controlada solo dentro de módulos que la gestionan (por ejemplo, un motor de reproducción).

### Programación orientada a contratos

- Comunicación entre capas mediante interfaces/tipos explícitos (`interface Repository`, `interface PlaybackEngine`, DTOs tipados).
- Eventos con nombres y payloads definidos (eventos Tauri, flujos de MediaController).
- El contrato es la fuente de verdad; las implementaciones son intercambiables.

## Reglas concretas para evitar anti-patrones

| Anti-patrón | Regla |
|---|---|
| **Componentes gigantes** | Un componente/composable no debe exceder ~150-200 líneas sin justificación. Si crece: extraer subcomponentes, hooks personalizados o lógica a servicios/stores. |
| **Servicios con demasiadas responsabilidades** | Un servicio/responsabilidad de dominio no debe hablar con más de una fuente de datos ni mezclar HTTP + persistencia + reglas de negocio. Dividir por responsabilidad. |
| **Lógica de negocio en componentes visuales** | Componentes y composables **no** calculan reglas de negocio, no llaman a la API directamente, no deciden validaciones de servidor. Consumen estado ya preparado y emiten intenciones (callbacks/acciones). |
| **Dependencias circulares** | Prohibido: A importa B que importa A. Detectar con revisión de imports; resolver moviendo el contrato compartido a un módulo neutral (tipos/contratos). |
| **Acceso directo a infraestructura desde presentación** | La UI no usa `fetch`, OkHttp, `invoke` de Tauri ni `MediaController` directamente: pasa por servicios/repositorios/`PlayerController` de la capa de infraestructura. |
| **Repetición de lógica de validación** | Una regla de validación vive en un solo lugar (función/módulo de dominio) y se consume desde donde haga falta. |
| **Uso indiscriminado de abstracciones** | No crear interfaces por crear. Umbral práctico: abstracción solo si hay (a) dos implementaciones reales previstas, (b) necesidad de sustituir en pruebas, o (c) acoplamiento a un detalle volátil (red, SO, hardware). |
| **Sobrearquitectura** | Ver YAGNI. Si la solución propuesta tiene más capas que líneas de lógica, revisarla. |
| **Estado con múltiples fuentes de verdad** | El estado de reproducción tiene **un** dueño por plataforma (ver [global-architecture.md](global-architecture.md#gestión-del-estado)). Nunca duplicar el estado del reproductor en la UI. |

## Verificación

Antes de aprobar una implementación, preguntar:

1. ¿Cada módulo tiene una responsabilidad clara y única?
2. ¿La UI depende de contratos, no de infraestructura concreta?
3. ¿Hay duplicación de reglas o tokens? ¿Dónde está la fuente única?
4. ¿Se introdujo una abstracción sin necesidad actual? ¿Se puede eliminar?
5. ¿El cambio es más simple que la alternativa descartada?

Documento relacionado: [implementation-instructions.md](implementation-instructions.md) (Paso 7: revisión final).
