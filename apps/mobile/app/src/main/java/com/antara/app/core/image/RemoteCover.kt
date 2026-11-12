package com.antara.app.core.image

import android.graphics.BitmapFactory
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.produceState
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.ConcurrentHashMap
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

private const val CONNECT_TIMEOUT_MS = 10_000
private const val READ_TIMEOUT_MS = 15_000

/** Caché en memoria de portadas; se descarta al cerrar el proceso. */
private val coverCache = ConcurrentHashMap<String, ImageBitmap>()

/**
 * Portada remota sobre el color de respaldo del design system.
 *
 * El proyecto no usa una librería de imágenes, así que se descarga con
 * `HttpURLConnection` en segundo plano y se guarda en memoria para no repetir
 * peticiones al hacer scroll. Si la URL falta o falla, queda el color.
 */
@Composable
fun RemoteCover(
    url: String?,
    fallbackColor: Color,
    modifier: Modifier = Modifier,
    contentDescription: String? = null,
) {
    val clave = url?.trim().orEmpty()
    val bitmap by produceState(initialValue = coverCache[clave], clave) {
        if (clave.isEmpty()) return@produceState
        coverCache[clave]?.let { cacheada ->
            value = cacheada
            return@produceState
        }
        val descargada = withContext(Dispatchers.IO) { descargar(clave) }
        if (descargada != null) coverCache[clave] = descargada
        value = descargada
    }

    Box(modifier = modifier.background(fallbackColor)) {
        bitmap?.let { imagen ->
            Image(
                bitmap = imagen,
                contentDescription = contentDescription,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop,
            )
        }
    }
}

private fun descargar(url: String): ImageBitmap? {
    var conexion: HttpURLConnection? = null
    return try {
        conexion = (URL(url).openConnection() as HttpURLConnection).apply {
            connectTimeout = CONNECT_TIMEOUT_MS
            readTimeout = READ_TIMEOUT_MS
            instanceFollowRedirects = true
        }
        conexion.inputStream.use { stream ->
            BitmapFactory.decodeStream(stream)?.asImageBitmap()
        }
    } catch (_: Exception) {
        null
    } finally {
        conexion?.disconnect()
    }
}

/**
 * Portada del backend: URL absoluta (Deezer, iTunes, Cover Art Archive) o ruta
 * relativa servida por el propio servidor (`/uploads/...`).
 */
fun resolveCoverUrl(portadaUrl: String?, baseUrl: String?): String? {
    val raw = portadaUrl?.trim().orEmpty()
    if (raw.isEmpty()) return null
    if (raw.startsWith("https://", ignoreCase = true) || raw.startsWith("http://", ignoreCase = true)) {
        return raw
    }
    if (raw.startsWith("data:image/", ignoreCase = true)) return raw
    if (raw.startsWith("//")) return "https:$raw"

    val base = baseUrl?.trim()?.trimEnd('/').orEmpty()
    if (base.isEmpty()) return null

    val ruta = raw.removePrefix("./").trimStart('/')
    return "$base/$ruta"
}
