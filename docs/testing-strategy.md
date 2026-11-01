# Estrategia de pruebas (Testing Strategy)

Estrategia común de pruebas para las tres plataformas. **Una funcionalidad no está terminada porque compile**: debe pasar las pruebas definidas en [development-workflow.md](development-workflow.md) (Paso 5).

## Niveles de prueba

| Nivel | Qué cubre | Dónde vive | Herramientas (estado actual: sin instalar → evaluar al implementar) |
|---|---|---|---|
| **Unitarias** | Reglas de negocio, mappers, utilidades, ViewModels, stores, servicios Rust | Junto al código (`*.test.ts`, `src/test/`, `#[cfg(test)]`) | Vitest · JUnit + coroutines-test/Turbine · Rust `cargo test` |
| **Integración** | ApiClient contra servidor simulado, repositorios, capa Tauri↔frontend | Junto al código o carpeta `__tests__/` | MSW (simulación HTTP) · MockWebServer/OkHttp · tests de comando Rust |
| **UI/Componentes** | Render, interacción, estados (loading/error/empty), accesibilidad básica | Junto al componente | @testing-library/react · Compose UI Test (androidTest) |
| **Navegación** | Flujos entre pantallas, back, deep links | E2E o UI test | Playwright (Web) · tauri-driver/WebDriver (Desktop, evaluar) · Espresso/Compose (Android) |
| **E2E de reproducción** | Reproducir, pausar, seek, cambiar de pista, cola | Manual semiautomatizado + automatizado donde sea viable | Checklist por plataforma (ver `testing.md` específicos) |
| **Regresión** | Flujo crítico existente: login → biblioteca → reproducir | E2E mínimo antes de release | Igual que navegación |
| **Accesibilidad** | Foco, contraste, labels, targets táctiles, zoom | Manual + herramientas | axe (Web) · Accessibility Scanner (Android) · revisión manual Desktop |
| **Consistencia visual** | Tokens, estados, textos equivalentes entre plataformas | Checklist manual por feature | Ver [ui-consistency.md](ui-consistency.md#cómo-revisar-consistencia) |

## Qué debe probarse antes de considerar terminada una funcionalidad

Checklist obligatorio (aplicado por plataforma):

1. **Unitarias** de toda regla de negocio nueva o transformación de datos (mappers, validaciones, lógica de cola).
2. **Pruebas de componente/pantalla** para: render correcto, estado de carga, estado vacío, estado de error y la acción principal.
3. **Integración de la capa API** de los endpoints nuevos (respuesta exitosa, error HTTP, red caída, parseo).
4. **Navegación**: la nueva pantalla se llega y se vuelve sin romper el flujo existente.
5. **Reproducción** (si aplica): play/pause/seek/pista siguiente con la feature incluida.
6. **Errores**: simular fallo de red y verificar mensaje comprensible + reintento.
7. **Accesibilidad**: tab/foco visible, etiquetas de iconos con acción, contraste, targets táctiles (Mobile), zoom 200%.
8. **Consistencia visual**: tokens usados, estados equivalentes, textos iguales en las tres plataformas afectadas.
9. **Sin regresiones**: las pruebas existentes siguen pasando (unitarias + E2E crítico).

## Pruebas por tipo de funcionalidad

| Tipo | Mínimo |
|---|---|
| Consulta/lista | Unit de mappers + test de estado loading/empty/error + prueba de paginación si aplica |
| Formulario | Validación unitaria + errores de servidor en UI + éxito y reset |
| Reproducción | Unit de lógica de cola + prueba manual de flujo completo + errores de stream |
| Sistema nativo (tray, MediaSession) | Ver `testing.md` de la plataforma (pruebas manuales estructuradas + automatización donde sea viable) |
| UI visual | Estados + responsividad (breakpoints/regiones) + consistencia de tokens |

## Convenciones

- Las pruebas se escriben **junto** al código que cubren; nombre `<sujeto>.test.<ext>`.
- Nunca dependen de red real: usan servidores simulados (MSW/MockWebServer) o mocks de contrato.
- Deterministas: sin `sleep` arbitrarios, sin orden de ejecución dependiente, sin datos de usuario reales.
- Los tests de UI cubren **comportamiento** (roles, textos, estados), no implementación interna (no atar clases CSS).
- Datos de prueba: fixtures propios (`test/fixtures/`), nunca datos personales.
- La deuda de testing actual es total (no hay ninguna prueba en el repo): se paga **feature a feature**, no en una iniciativa global única.

## Estado actual y herramientas a evaluar

Hoy **no existe ninguna prueba automatizada** ni framework instalado. Al implementar la primera feature:

| Plataforma | Candidatos (evaluar coste/beneficio al agregar) |
|---|---|
| Web | Vitest + @testing-library/react + MSW (+ Playwright para E2E) |
| Desktop | Igual que Web + evaluación de `tauri-driver`/WebDriver para E2E de la ventana |
| Mobile | JUnit + kotlinx-coroutines-test + Turbine (Flow) + Compose UI Test + Espresso (ya parcialmente declaradas en Gradle) |
| Rust (Tauri) | `cargo test` nativo para `commands/` y `services/` |

Toda herramienta nueva se registra en [`decisions/README.md`](decisions/README.md) con justificación (evitar dependencias innecesarias, ver [architecture-principles.md](architecture-principles.md#yagni)).

Relacionado: [`apps/desktop/docs/testing.md`](../apps/desktop/docs/testing.md), [`apps/mobile/docs/testing.md`](../apps/mobile/docs/testing.md), [development-workflow.md](development-workflow.md).
