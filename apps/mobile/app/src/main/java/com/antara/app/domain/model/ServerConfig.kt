package com.antara.app.domain.model

/** Servidor (IP o dominio) al que la aplicación puede conectarse. */
data class ServerConfig(
    val address: String,
    val isActive: Boolean = false,
) {
    /** Texto legible sin el esquema: `192.168.1.10:8080` o `mi-servidor.com`. */
    val displayName: String
        get() = address
            .removePrefix("https://")
            .removePrefix("http://")
            .trimEnd('/')
}

/** Lista persistida de servidores junto con el que está activo. */
data class SavedServers(
    val servers: List<ServerConfig> = emptyList(),
    val active: ServerConfig? = null,
) {
    val isEmpty: Boolean get() = servers.isEmpty()
}
