# System Tray y Close to Tray (Desktop)

Documento **obligatorio**: describe la implementación de la funcionalidad de bandeja del sistema y el cierre a bandeja en la aplicación Desktop (Windows). Cualquier feature que toque ciclo de vida, ventanas o ejecución en segundo plano **debe** consultar este documento primero (ver [implementation-instructions.md](implementation-instructions.md)).

> **Estado actual:** la System Tray **aún no está implementada** (la app es la plantilla Tauri 2; ver [README.md](README.md)). Este documento define el diseño objetivo y el procedimiento de implementación; el comportamiento descrito es el requisito a cumplir, no una funcionalidad existente.

> **No se elimina, simplifica ni sustituye esta funcionalidad sin justificación técnica documentada** en [../../docs/decisions/README.md](../../../docs/decisions/README.md).

## Objetivo

La aplicación debe continuar ejecutándose cuando el usuario pulsa el botón **X** de la ventana principal. En lugar de terminar el proceso, la ventana se **oculta** y permanece un icono en la bandeja del sistema de Windows, manteniendo viva la reproducción de música.

## Comportamiento esperado (escenario)

1. El usuario inicia la aplicación.
2. Comienza a reproducir música.
3. Pulsa el botón X de la ventana.
4. La ventana desaparece (se oculta; **no** se destruye).
5. El proceso de Tauri continúa activo (visible en el administrador de tareas como proceso de la app).
6. La reproducción de música **continúa** sin interrupción.
7. El icono de la aplicación permanece en la System Tray de Windows.
8. El usuario puede volver a abrir la ventana desde el icono (click izquierdo o menú "Abrir").
9. El usuario puede cerrar **completamente** la aplicación mediante una opción explícita ("Salir" en el menú de bandeja).

## Requisitos funcionales

### Icono de bandeja

- Mostrar el icono de la aplicación durante toda la vida del proceso (crear en `.setup()`).
- Permitir interacción: click izquierdo → mostrar/ocultar ventana; click derecho → menú contextual.
- Actualizar el tooltip con la pista en reproducción cuando corresponda (opcional pero deseado: "Antara — <título>").
- Gestionar el ciclo de vida: un solo icono, sin duplicados; se destruye solo al salir del proceso.

**Icono de diseño:**

- Debe ser legible a **16×16 px** (tamaño real de la bandeja): simplificado, sin detalles finos.
- Preferir versión monocroma/blanca sobre fondo transparente (Windows aplica el tratamiento de bandeja); incluir tamaño 16/24/32 en el recurso.
- Usar los iconos del bundle (`src-tauri/icons/icon.ico` multi-resolución) o un recurso dedicado `icons/tray.ico`.

### Menú contextual

Incluir, como mínimo:

| Item | Acción |
|---|---|
| **Abrir Antara** | Muestra y enfoca la ventana principal |
| *separador* | |
| **Reproducir / Pausar** | Alterna la reproducción (etiqueta dinámica según estado real) |
| **Siguiente pista** | Avanza en la cola |
| **Pista anterior** | Retrocede en la cola |
| *separador* | |
| **Salir** | Sale del proceso (salida explícita y controlada) |

Reglas:

- Los controles de reproducción están **conectados al estado real del reproductor**: la etiqueta "Reproducir"/"Pausar" refleja el estado actual (ver "Comunicación" abajo).
- Si no hay reproducción iniciada, "Reproducir" puede estar deshabilitado o actuar sobre la última cola (decisión de UX; mantener consistente con la UI).
- El menú se crea en Rust; sus textos se actualizan desde el frontend mediante un comando delgado.

### Comportamiento del cierre

- **Interceptar** el evento de cierre de la ventana (`WindowEvent::CloseRequested`).
- **Evitar** que la aplicación se cierre cuando el usuario pulsa X: `api.prevent_close()` + `window.hide()`.
- **No destruir** los servicios de reproducción (ocultar la ventana no detiene el webview ni el audio).
- **Permitir** una salida explícita y controlada solo desde "Salir" del menú de bandeja.
- Si el usuario elige salir mientras reproduce: detener la reproducción limpiamente (liberar el motor), guardar estado si aplica, y salir.

## Implementación técnica (Tauri 2)

> APIs verificadas para **Tauri 2** (no usar APIs de Tauri 1: `SystemTray`, `SystemTrayEvent`, `tray_handle`). Verificar siempre contra la versión instalada con `cargo doc --open -p tauri` o [docs.rs/tauri](https://docs.rs/tauri/latest/tauri/tray/).

### 1. Habilitar la feature de bandeja

En `src-tauri/Cargo.toml`:

```toml
[dependencies]
tauri = { version = "2", features = ["tray-icon"] }
```

La API de bandeja (`tauri::tray::TrayIconBuilder`) está disponible **solo con esta feature** y solo en desktop.

### 2. Crear la bandeja y el menú (servicio `services/tray.rs`)

```rust
use tauri::{
    menu::{Menu, MenuItem, PredefinedMenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager, Wry,
};

pub fn setup_tray(app: &AppHandle) -> tauri::Result<()> {
    // Items con ID estables para manejar eventos
    let open = MenuItem::with_id(app, "open", "Abrir Antara", true, None::<&str>)?;
    let play_pause = MenuItem::with_id(app, "play_pause", "Reproducir", true, None::<&str>)?;
    let next = MenuItem::with_id(app, "next", "Siguiente pista", true, None::<&str>)?;
    let prev = MenuItem::with_id(app, "prev", "Pista anterior", true, None::<&str>)?;
    let sep = PredefinedMenuItem::separator(app)?;
    let quit = MenuItem::with_id(app, "quit", "Salir", true, None::<&str>)?;

    let menu = Menu::with_items(app, &[&open, &play_pause, &next, &prev, &sep, &quit])?;

    let mut builder = TrayIconBuilder::with_id("main-tray")
        .icon(app.default_window_icon().expect("icono de bundle requerido"))
        .tooltip("Antara")
        .menu(&menu)
        .show_menu_on_left_click(false)   // click izquierdo = ventana; derecho = menú
        .on_menu_event(|app, event| match event.id.as_ref() {
            "open" => show_main_window(app),
            "play_pause" => { let _ = app.emit("tray:toggle-play", ()); }
            "next" => { let _ = app.emit("tray:next", ()); }
            "prev" => { let _ = app.emit("tray:prev", ()); }
            "quit" => app.exit(0),         // salida explícita
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            // Click izquierdo: alternar visibilidad de la ventana
            if let TrayIconEvent::Click { button: MouseButton::Left, button_state: MouseButtonState::Up, .. } = event {
                let app = tray.app_handle();
                match app.get_webview_window("main") {
                    Some(w) if w.is_visible().unwrap_or(false) => { let _ = w.hide(); }
                    Some(w) => show_main_window(app),
                    None => {}
                }
            }
        });

    builder.build(app)?;
    Ok(())
}

fn show_main_window(app: &AppHandle) {
    if let Some(w) = app.get_webview_window("main") {
        let _ = w.show();
        let _ = w.unminimize();
        let _ = w.set_focus();
    }
}
```

Notas:

- `show_menu_on_left_click(false)` (disponible desde Tauri 2.2; `menu_on_left_click` está deprecado) permite el patrón de Windows: **click izquierdo abre la ventana, click derecho abre el menú**.
- El `icon` proviene del icono por defecto del bundle; si se quiere un icono dedicado, usar `tauri::Image::from_bytes(include_bytes!("../../icons/tray.ico"))`.
- Registrar el servicio en `.setup()` de `lib.rs`: `tray::setup_tray(app.handle())?;`.

### 3. Interceptar el cierre de la ventana (en `lib.rs`)

```rust
tauri::Builder::default()
    .setup(|app| { tray::setup_tray(app.handle())?; Ok(()) })
    .on_window_event(|window, event| {
        if let tauri::WindowEvent::CloseRequested { api, .. } = event {
            // Close-to-Tray: ocultar, no cerrar
            let _ = window.hide();
            api.prevent_close();
        }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
```

Complemento recomendado (cinturón y tirantes): si todas las ventanas se cierran de todas formas, `RunEvent::ExitRequested { code, api }` con `code.is_none()` debe también bloquearse (`api.prevent_exit()`) para no salir sin haber pasado por "Salir". El flujo canónico es: X → `CloseRequested` prevenido → ventana oculta; "Salir" → `app.exit(0)`.

### 4. Actualizar el menú desde el estado real del reproductor

El estado del reproductor vive en React (ADR-011). Flujo:

```text
React (store player) ──comando set_playback_state──► Rust actualiza textos del menú
Rust (menú "play_pause") ──evento tray:toggle-play──► React ejecuta toggle en el store
```

- **Rust → React:** `app.emit("tray:toggle-play", ())` como en el ejemplo; en React, suscribirse vía `integrations/tauri/events.ts` y ejecutar la acción del store (limpiar el listener al desmontar).
- **React → Rust:** comando delgado registrado en `invoke_handler`:

```rust
#[tauri::command]
pub fn set_playback_state(app: AppHandle, playing: bool, title: Option<String>) -> Result<(), AppError> {
    tray::update_menu_labels(&app, playing, title.as_deref())
}
```

  donde `update_menu_labels` hace `item.set_text("Pausar" | "Reproducir")` sobre el `MenuItem` guardado (guardarlo en `state.rs` o en el `TrayIcon` mediante `tray.menu()`).
- El frontend llama a este wrapper en los cambios de estado relevantes (play/pause, cambio de pista). **Nunca** un bucle de alta frecuencia: solo en cambios de evento.

### 5. Permisos (capabilities)

- Si la bandeja y el menú se crean **totalmente en Rust**, no se requiere ninguna capacidad nueva (las capabilities solo restringen el IPC invocado desde JS).
- Si se usa la **API de JS** (`@tauri-apps/api/tray`, `@tauri-apps/api/menu`), agregar en `src-tauri/capabilities/default.json`:

```json
"permissions": ["core:default", "opener:default", "core:tray:default", "core:menu:default"]
```

  (`core:tray:default` incluye `allow-new`, `allow-set-icon`, `allow-set-menu`, `allow-set-tooltip`, etc.) — decisión: se prefiere la implementación en Rust (menos superficie de IPC).

### 6. Plugins recomendados

| Plugin | Propósito | Motivo |
|---|---|---|
| `tauri-plugin-single-instance` | Segunda ejecución enfoca la ventana existente | Evita instancias duplicadas al abrir desde el menú Inicio mientras la app está oculta en bandeja (requisito de pruebas) |
| `tauri-plugin-window-state` | Persistir tamaño/posición/maximizado | Coherencia de UX tras ocultar/restaurar |

Registrar su adición en [../../docs/decisions/README.md](../../../docs/decisions/README.md) y sus permisos en capabilities si los exigen.

### 7. Comunicación y estado

- Rust **no** duplica el estado del reproductor: solo recibe `set_playback_state` para reflejarlo en el menú.
- La UI refleja las acciones de bandeja mediante los eventos `tray:*` (una sola fuente de verdad: el store).
- La ventana oculta **no** significa pausa: el webview sigue vivo y el audio continúa (ver [audio-playback.md](audio-playback.md#ciclo-de-vida-y-ventana-oculta)).

## Ciclo de vida

| Acción | Efecto | Proceso | Reproducción | Icono en bandeja |
|---|---|---|---|---|
| **Minimizar** (−) | Ventana minimizada a la taskbar | Activo | Continúa | Presente (si ya fue creado) |
| **Ocultar** (X → Close-to-Tray) | `window.hide()`; ventana fuera de taskbar | Activo | **Continúa** | Presente; click izquierdo restaura |
| **Cerrar ventana** (destrucción real) | `window.destroy()`/close sin prevent | Depende: sin otras ventanas → termina | Se detiene | Desaparece con el proceso |
| **Salir** (menú bandeja) | `app.exit(0)` → `ExitRequested` con código | **Termina** | Se detiene (liberar motor antes) | Desaparece |
| **Reiniciar la app** | Salir + volver a lanzar | Nuevo proceso | Se reinicia | Recreado |
| **Segunda ejecución** (single-instance) | Enfoca/restaura la ventana existente | Uno solo | No se interrumpe | Uno solo |

Reglas:

- **La reproducción no depende de que la ventana esté visible.** Verificar en pruebas (ver abajo).
- La destrucción de la ventana solo ocurre en la salida explícita.
- Windows puede terminar procesos desde el Administrador de tareas: eso es fuera de control de la app (no prometer otra cosa).

## Pruebas obligatorias

Ver detalle en [testing.md](testing.md). Manual/estructurado antes de cerrar cualquier cambio que toque este documento:

1. **Cerrar la ventana durante la reproducción** → ventana oculta, proceso activo, audio continúa, icono presente.
2. **Cerrar la ventana sin reproducción** → ventana oculta, proceso activo, sin errores en consola.
3. **Recuperar la ventana desde System Tray** → click izquierdo la muestra y enfoca; "Abrir Antara" también.
4. **Pausar desde el menú contextual** → el reproductor real se pausa y la UI lo refleja.
5. **Reanudar desde el menú contextual** → reproducción continúa; etiqueta del menú se actualiza.
6. **Cambiar de pista desde el menú** → la UI refleja la nueva pista; el menú se actualiza si muestra título.
7. **Salir explícitamente** → proceso termina (sin huérfanos), audio detenido.
8. **Sin procesos huérfanos** tras "Salir" (verificar en el Administrador de tareas de Windows).
9. **Sin instancias duplicadas**: con la app oculta en bandeja, lanzarla de nuevo desde Inicio → enfoca la ventana existente (requiere `single-instance`).
10. **Ciclo X → mostrar → X** repetido varias veces → el botón X sigue funcionando (verificar por regresión el comportamiento conocido de Tauri tras ciclos hide/show; si se reproduce un fallo, documentarlo y buscar la solución en issues de Tauri antes de parchear).

## Reglas de mantenimiento

- Todo cambio en este documento o en su implementación requiere justificación y ADR nuevo/actualizado.
- Las funciones de tray viven en `services/tray.rs`; **no** se mezclan con lógica de reproducción ni de UI.
- Si se agrega una acción al menú, agregar su evento/ comando tipado + prueba en la misma feature.
