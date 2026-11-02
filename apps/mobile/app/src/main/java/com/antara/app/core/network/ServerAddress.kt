package com.antara.app.core.network

import java.net.URI

/**
 * Normaliza y valida una dirección de servidor introducida por el usuario.
 *
 * Acepta IP o dominio, con puerto opcional y esquema opcional:
 * - `192.168.1.10:8080` → `http://192.168.1.10:8080`
 * - `https://mi-servidor.com` → `https://mi-servidor.com`
 * - `localhost:5000` → `http://localhost:5000`
 *
 * Devuelve `null` cuando la dirección no es válida.
 */
object ServerAddress {

    fun normalize(raw: String): String? {
        val trimmed = raw.trim()
        if (trimmed.isEmpty()) return null

        val hasScheme = trimmed.startsWith("http://", ignoreCase = true) ||
            trimmed.startsWith("https://", ignoreCase = true)
        val candidate = if (hasScheme) trimmed else "http://$trimmed"

        val uri = runCatching { URI(candidate) }.getOrNull() ?: return null
        val scheme = uri.scheme?.lowercase() ?: return null
        if (scheme != "http" && scheme != "https") return null

        val host = uri.host ?: return null
        if (host.isBlank()) return null
        if (uri.userInfo != null) return null
        if (uri.port != -1 && uri.port !in 1..65535) return null

        val path = uri.path.orEmpty().trimEnd('/')
        return buildString {
            append(scheme)
            append("://")
            append(host)
            if (uri.port != -1) {
                append(':')
                append(uri.port)
            }
            append(path)
        }
    }
}
