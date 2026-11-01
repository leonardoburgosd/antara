# Estándares de código — Desktop

Estándares **adicionales** a los globales ([../../docs/coding-standards.md](../../../docs/coding-standards.md)) para Rust, Tauri 2, React/TypeScript, Tailwind CSS, Motion, comunicación frontend↔Rust e integración con Windows.

## Rust

- `Result`/`Option` en todos los flujos con fallo posible; propagar con `?` y manejar en la frontera (comando/evento), registrando el error.
- **Sin `unwrap()`/`expect()` en flujos normales.** Excepciones justificadas: código de arranque donde el fallo es fatal, pruebas `#[cfg(test)]`, o invariantes imposibles con comentario explícito. En handlers de ventana/bandeja (dónde el código de ejemplo de Tauri suele usarlos), capturar el `Result` y registrar con `log::error!`.
- Ownership/borrowing correctos; sin clonados defensivos sin necesidad.
- **Sin estado global mutable** (`static mut`, `lazy_static` mutables): usar estado gestionado por Tauri (`app.manage::<T>()`, acceder con `State<'_, T>`) o `Mutex` local acotado.
- Módulos con responsabilidad única (`commands/`, `services/`, `state`, `error`); sin módulos misceláneos.
- Tipos de error con `enum` propio (o `thiserror` si se justifica la dependencia) + conversión a `String`/struct serializable para el IPC.
- Documentar con `///` toda API pública y todo `#[tauri::command]` (es la interfaz del frontend).
- `cargo fmt` y `cargo clippy` antes de cerrar cambios; sin `#[allow]` globales.

## Tauri 2

- **Comandos delgados:** argumentos validados, delegación a servicios, `Result` de vuelta. Sin lógica de negocio compleja en comandos (ver [architecture.md](architecture.md)).
- **Mínimo privilegio:** capabilities por ventana y solo los permisos usados. Cada plugin nuevo exige su permiso explícito en `capabilities/default.json`.
- **Eventos:** nombres `dominio:accion`; payloads pequeños y tipados; toda suscripción JS limpia su listener.
- **Nombres de ventana estables:** etiqueta `main` (la usan capabilities y handlers).
- **Plugins:** evaluar antes de añadir (oficiales primero: `tray-icon` feature, `window-state`, `single-instance`, `opener` ya presente). Registrar la adición en [../../docs/decisions/README.md](../../../docs/decisions/README.md) si cambia la arquitectura.
- **No** usar APIs de Tauri 1 (`SystemTray`, `Manager::tray_handle`, `tauri::api`); este proyecto es Tauri 2 (APIs: `tauri::tray::TrayIconBuilder`, `tauri::menu`, `WindowEvent::CloseRequested`).
- CSP activa en producción (ver [../../docs/security.md](../../../docs/security.md)); `csp: null` es deuda a corregir.

## React / TypeScript (aplicación Desktop)

- `strict: true` ya activo: mantenerlo; sin `any`, sin `as` para parchear errores de tipo.
- Componentes pequeños; lógica en hooks/stores/servicios; sin `invoke` ni `fetch` en JSX o hooks de render.
- Stores con un solo dueño por dominio (ver ADR-011 en [../../docs/decisions/README.md](../../../docs/decisions/README.md)).
- Accesibilidad: foco visible con `:focus-visible`, navegación por teclado completa (la app es de escritorio: **el teclado es primario**), etiquetas en iconos con acción.

## Tailwind CSS

- **Tokens, nunca literales:** prohibido `bg-[#0D0D12]`, `text-[#fff]` etc. Usar las utilidades derivadas de `@theme` (`bg-surface`, `text-secondary`, `border`…) definidas en `styles/index.css` según [../../docs/design-system.md](../../../docs/design-system.md).
- Sin `!important` salvo justificación.
- Responsive por **regiones de ventana** (ver [../../docs/responsive-design.md](../../../docs/responsive-design.md#desktop--ventanas-redimensionables-windows)), no por breakpoints de navegador: usar variables/contenedores o `useMediaQuery` para la región actual.
- Clase `cn()` (clsx-equivalente) para condicionales; sin concatenación manual de strings de clases.

## Motion (framer-motion)

- Animar `transform`/`opacity` únicamente; variantes compartidas en un módulo (`styles/motion.ts`).
- Respetar `useReducedMotion` de framer-motion.
- Loop infinito solo en elementos pequeños (ecualizador); nada de loops en paneles completos.
- `AnimatePresence` para salidas de modales/menús; limpiar al desmontar.
- Equivalencias con Compose: [../../docs/design-system.md](../../../docs/design-system.md#equivalencias-motion--jetpack-compose).

## Comunicación frontend ↔ Rust

- **Wrapper único:** los componentes nunca llaman `invoke()` directamente; usan `integrations/tauri/commands.ts` con funciones tipadas:

```ts
export async function setPlaybackState(playing: boolean, title?: string): Promise<void> {
  await invoke('set_playback_state', { playing, title });
}
```

- **Eventos:** suscripciones centralizadas en `integrations/tauri/events.ts`, devolviendo la función de cleanup; los hooks las consumen.
- **Errores IPC:** el wrapper captura y relanza como `AppError` para que la UI use el flujo normal de errores ([../../docs/error-handling.md](../../../docs/error-handling.md)).
- **Contratos:** al agregar un comando, actualizar su wrapper **en el mismo cambio** (frontend y Rust nunca se desincronizan).

## Integración con Windows

- Rutas de usuario/`APPDATA` mediante crates de directorios conocidos; jamás rutas absolutas fijas.
- No bloquear el hilo principal: I/O largo en `async`/`spawn_blocking`.
- DPI: la UI usa px/`rem` coherentes con el sistema de diseño; probar a 125%/150% de escala (ver [ui-guidelines.md](ui-guidelines.md)).
- Iconos de bandeja: recurso `.ico`/PNG con tamaño múltiple; legible a 16px (ver [system-tray.md](system-tray.md#icono-de-bandeja)).
- Al cerrar/ocultar: respetar el ciclo definido en [system-tray.md](system-tray.md#ciclo-de-vida); no destruir servicios de reproducción al ocultar.
- Salida del proceso: solo mediante la salida explícita definida (menú "Salir"), nunca matando procesos desde JS.

## Pruebas

Ver [testing.md](testing.md). Reglas mínimas: toda función pura de lógica y todo mapper con test; wrappers de IPC con al menos un test de propagación de errores.
