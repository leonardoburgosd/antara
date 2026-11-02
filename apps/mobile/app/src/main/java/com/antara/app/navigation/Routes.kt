package com.antara.app.navigation

/**
 * Rutas de navegación (estándar: rutas centralizadas en `navigation/`).
 * Sin librería de navegación: se usan como claves de estado en [AppRoot].
 */
object Routes {
    /** Detalle de "Canciones que te gustan". */
    const val LIKED = "liked"

    /** Prefijo de detalle de álbum: `album:<id>`. */
    const val ALBUM_PREFIX = "album:"

    /** Ruta del detalle de un álbum. */
    fun album(id: String) = ALBUM_PREFIX + id
}
