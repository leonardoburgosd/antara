package com.antara.app.core.network

import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject

/**
 * Cliente HTTP único de la app (ADR-007), sin dependencias externas:
 * `HttpURLConnection` + `org.json` del SDK.
 *
 * Ningún componente llama a la red directamente: todos pasan por [postJson],
 * que compone la URL base configurada por el usuario con la ruta del catálogo
 * [Endpoints], aplica timeout y traduce los errores a [ApiError].
 */
object ApiClient {

    private const val TIMEOUT_MS = 10_000

    /**
     * Compone la URL final: URL base introducida manualmente por el usuario
     * (ej. `http://192.168.1.10:5006`) + ruta relativa del endpoint.
     */
    fun buildUrl(baseUrl: String, path: String): String =
        baseUrl.trim().trimEnd('/') + "/" + path.trimStart('/')

    /** POST JSON y devuelve el cuerpo de la respuesta como objeto JSON. */
    suspend fun postJson(
        baseUrl: String,
        path: String,
        body: JSONObject,
        token: String? = null,
    ): JSONObject = withContext(Dispatchers.IO) {
        val connection = (URL(buildUrl(baseUrl, path)).openConnection() as HttpURLConnection).apply {
            requestMethod = "POST"
            connectTimeout = TIMEOUT_MS
            readTimeout = TIMEOUT_MS
            doOutput = true
            setRequestProperty("Content-Type", "application/json")
            setRequestProperty("Accept", "application/json")
            if (token != null) {
                setRequestProperty("Authorization", "Bearer $token")
            }
        }

        try {
            connection.outputStream.use { stream ->
                stream.write(body.toString().toByteArray(Charsets.UTF_8))
            }

            val status = connection.responseCode
            if (status !in 200..299) {
                connection.errorStream?.close()
                throw errorFor(status)
            }

            val text = connection.inputStream
                ?.bufferedReader()
                ?.use { it.readText() }
                .orEmpty()

            if (text.isBlank()) return@withContext JSONObject()

            runCatching { JSONObject(text) }.getOrElse { throw ApiError.Parsing }
        } catch (error: ApiError) {
            throw error
        } catch (_: IOException) {
            throw ApiError.Network
        } finally {
            connection.disconnect()
        }
    }

    private fun errorFor(status: Int): ApiError = when (status) {
        400 -> ApiError.Validation
        401 -> ApiError.Unauthorized
        404 -> ApiError.NotFound
        503 -> ApiError.Unavailable
        else -> ApiError.Server
    }
}
