# Estándares de código (Coding Standards)

Estándares generales y por lenguaje. Los documentos específicos de plataforma añaden reglas adicionales: [Desktop](../apps/desktop/docs/coding-standards.md), [Mobile](../apps/mobile/docs/coding-standards.md).

## Reglas transversales

1. **Sin `any` implícitos, sin casts de escape, sin `!!`/`unwrap()` en flujos normales.**
2. **Los nombres explican la intención**: `isPlaying`, `loadAlbum`, `PlaybackService`; no `data2`, `handler`, `temp`.
3. **Funciones pequeñas y con un propósito**; si una función necesita comentarios para explicar bloques, se parte.
4. **Los efectos secundarios están declarados y acotados** (red, disco, SO) y viven en la capa de infraestructura.
5. **Sin código muerto**: no se versionan restos de plantillas sin usar (ver deudas detectadas en [project-structure.md](project-structure.md#estado-actual-del-código)).
6. **Los imports son explícitos y ordenados** (relativos del proyecto primero, externos después; sin imports circulares).
7. **Todo lo nuevo se prueba** según [testing-strategy.md](testing-strategy.md).
8. **Todo cambio actualiza documentación** si introduce decisiones, dependencias o comportamientos nuevos.

## TypeScript

- **Tipado estricto**: `strict: true` obligatorio en todos los proyectos (Web aún no lo tiene; corregir al tocar el tsconfig).
- **Prohibido `any`**. Usar `unknown` + narrowing cuando el tipo venga de fuera; tipos de dominio explícitos.
- Interfaces y tipos correctamente definidos:
  - `interface` para contratos de objetos consumidos; `type` para unions/aliases.
  - DTOs de API tipados y separados de las entidades de dominio.
  - Sin tipos `as` para "arreglar" errores de tipo; corregir el origen.
- **Separación de responsabilidades**: un archivo exporta una responsabilidad; los módulos de servicio no importan componentes.
- **Nombres**: `camelCase` funciones/variables, `PascalCase` tipos/componentes, `useXxx` hooks, `XXXDto`/`XXXResponse` para contratos de red cuando haya ambigüedad.
- **Imports**: sin importaciones circulares; los exports de `features/` se hacen por `index.ts`; no importar entre features directamente (pasar por `components/`, `services/` o props).
- **Manejo de errores**: nunca `catch` vacíos; siempre tipar el error y traducirlo a `AppError` (ver [error-handling.md](error-handling.md)).
- **Funciones puras** para lógica de transformación (mappers, cálculos) → testeables sin DOM.

## React

- **Componentes funcionales pequeños y especializados** (~150-200 líneas máximo); extraer subcomponentes antes de crecer.
- **Separación presentación/lógica**:
  - Componentes presentacionales: reciben props tipadas, no tienen efectos de red.
  - Contenedores/hooks: cargan datos y exponen estado.
- **Custom hooks** para lógica reutilizable (`usePlayer`, `useDebouncedValue`); no hooks que "hagan todo".
- **Estado**: local (`useState`) por defecto; estado compartido en stores; evitar `useEffect` para derivar valores (calcular durante el render o con `useMemo`).
- **Efectos secundarios innecesarios**: sin `useEffect` que solo sincroniza props→estado; sin timers/fetch sueltos sin cleanup.
- **Optimización basada en mediciones**: no envolver en `React.memo`/`useMemo` de forma preventiva; medir con el profiler y optimizar donde haya problemas reales.
- **Accesibilidad**: elementos interactivos nativos (`button`, `a`, `input`), `aria-*` cuando el elemento no nativo, foco visible, texto alternativo en imágenes, contraste según [design-system.md](design-system.md), soporte de `prefers-reduced-motion`.
- **Sin prop drilling excesivo** (más de 3 niveles): usar composición o un store.
- **Sin lógica compleja dentro del JSX**: el JSX describe; la lógica vive en el cuerpo del componente o en hooks.

## Rust (específico de Desktop, aplicable cuando exista código Rust)

- **Gestión de errores con `Result` y `Option`**: propagar con `?`, manejar en la frontera (comando/evento) y registrar.
- **Evitar `unwrap()`/`expect()` en flujos normales**: solo en `#[cfg(test)]`, en código de arranque donde el fallo es fatal e ineludible, o con comentario que justifique la invariante. En handlers de ventana/bandeja (dónde hoy se suele usar) preferir manejar el `Result` y registrar.
- **Ownership y borrowing correctos**: sin clonar para "evitar problemas"; sin `Arc<Mutex<…>>` global salvo justificación (preferir estado gestionado por Tauri: `app.manage()`).
- **Módulos con responsabilidades claras** (`commands/`, `services/`, `state`), sin módulos "misc".
- **Tipos explícitos** en APIs públicas; tipos de error con `thiserror` (o `enum` propio) cuando haya varios orígenes.
- **Evitar estado global mutable** (`static mut`, `lazy_static` mutables): usar `State` gestionado por Tauri o `Mutex` local acotado.
- **Documentar interfaces públicas** (`///`) y nombres de comandos que consuma el frontend.
- **No bloquear el hilo principal**: operaciones de I/O largas en `async`/threads; los comandos de UI son rápidos.

## Kotlin (específico de Mobile)

- **Kotlin idiomático**: data classes, `when` exhaustivo, extensiones medidas, `let/also` solo cuando aporten claridad, sin `!!` (usar tipos nulos correctamente y `?.let`/`?.`).
- **Coroutines y Flow**:
  - `suspend` para operaciones de una sola emisión (red).
  - `Flow`/`StateFlow` para estado continuo.
  - Contextos correctos: `viewModelScope` para UI, `Dispatchers.IO` para red/disco (inyectados, no hardcodeados en el dominio).
  - Sin corutinas global scope; cancelación respetada.
- **Inyección de dependencias**: contenedor manual (`AppContainer`) mientras el grafo sea pequeño; sin singletons con estado oculto fuera del contenedor (ver decisión en [`decisions/README.md`](decisions/README.md)).
- **Separación UI/dominio/datos** conforme a [`apps/mobile/docs/architecture.md`](../apps/mobile/docs/architecture.md).
- **Sin lógica de negocio en composables**: los composables reciben estado y callbacks; las decisiones viven en ViewModels/dominio.
- **Ciclo de vida correcto**: observar flujos con `collectAsStateWithLifecycle`, no con `collectAsState` para red; liberar `MediaController` en el momento correcto (ver [`background-playback.md`](../apps/mobile/docs/background-playback.md)).
- **Tipos no nulos** cuando sea posible; datos de red con defaults defensivos solo donde el contrato lo permita.
- **Errores centralizados**: modelos de error sellados mapeados a `UiState.Error` en ViewModels; los composables nunca tratan excepciones.

## Tailwind CSS

- Usar los **tokens** del design system (variables en `styles/`/`index.css` y bloque `@theme` de Tailwind v4). **Prohibido** hex arbitrarios en componentes (`bg-[#1C1C1E]`); usar clases semánticas (`bg-surface-elevated`).
- Preferir utilidades estándar sobre personalizaciones ad-hoc.
- Clases condicionales con `cn`/`clsx`-equivalente cuando la lógica crezca; sin strings de clases construidos a mano con `+`.
- Responsive: seguir los breakpoints de [responsive-design.md](responsive-design.md); en Desktop usar regiones de ventana, no breakpoints de navegador.
- Sin `!important` salvo justificación documentada.

## Motion (framer-motion)

- Animar **transform y opacity**; evitar animar `width`, `height`, `top`, `left` (costoso en layout).
- Variantes compartidas para entradas/salidas (`fadeUp`, `fadeIn`, `scaleIn`) definidas en un solo lugar.
- Respetar `prefers-reduced-motion` (hook `useReducedMotion` de Motion; en Compose, desactivar animaciones decorativas).
- Sin animaciones infinitas en elementos de gran superficie; los loops solo para indicadores pequeños (p. ej. ecualizador).
- Limpiar animaciones al desmontar (Motion lo hace por defecto con `AnimatePresence`).
- Equivalencias con Compose: ver [design-system.md](design-system.md#animaciones).

## Reglas de documentación de código

- Comentarios en español o inglés **consistente** por repositorio (hoy el código de plantilla está en inglés; mantener inglés en identificadores/comentarios técnicos de código, español en documentación `docs/`).
- Los comentarios explican **por qué**, no **qué**.
- Toda API pública documentable (comandos Rust, interfaces de servicio) tiene doc de una línea como mínimo.
