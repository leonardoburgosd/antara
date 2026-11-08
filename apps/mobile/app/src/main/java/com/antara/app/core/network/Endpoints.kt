package com.antara.app.core.network

/**
 * Catálogo central de rutas del backend.
 *
 * Regla de integración (ADR-016): aquí solo viven rutas relativas. La URL base
 * la configura el usuario en la pantalla de servidores y [ApiClient] compone
 * `baseUrl + path` en cada consulta. Nunca se escribe un host en estas rutas.
 */
object Endpoints {

    /** `POST { email, password }` → usuario + token (`UsuarioController.LoginAsync`). */
    const val LOGIN = "/api/usuario/login"
}
