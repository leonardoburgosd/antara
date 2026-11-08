package com.antara.app.core.network

/**
 * Error normalizado del cliente HTTP (ver `docs/error-handling.md`).
 * La UI traduce cada caso a un mensaje en español; los datos técnicos
 * (cuerpo de la respuesta) no se muestran.
 */
sealed class ApiError(message: String) : Exception(message) {

    /** 400: datos inválidos. */
    data object Validation : ApiError("Los datos enviados no son válidos.")

    /** 401: no autorizado. */
    data object Unauthorized : ApiError("No autorizado.")

    /** 403: autenticado sin permisos para el recurso. */
    data object Forbidden : ApiError("No tienes permisos para realizar esta acción.")

    /** 404: recurso no encontrado (en login, credenciales incorrectas). */
    data object NotFound : ApiError("Recurso no encontrado.")

    /** 503: el backend no está disponible (p. ej. sin administrador registrado). */
    data object Unavailable : ApiError("El servidor no está disponible.")

    /** 5xx: error interno del servidor. */
    data object Server : ApiError("Error del servidor.")

    /** Sin red, DNS o timeout. */
    data object Network : ApiError("No se pudo conectar con el servidor.")

    /** El cuerpo de la respuesta no tiene el formato esperado. */
    data object Parsing : ApiError("La respuesta del servidor no es válida.")
}
