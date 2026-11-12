package com.antara.app.features.servers

import com.antara.app.domain.model.ServerConfig

/** Estado de UI de la configuración de servidores. */
data class ServersUiState(
    val servers: List<ServerConfig> = emptyList(),
    val active: ServerConfig? = null,
    val input: String = "",
    val errorRes: Int? = null,
    val isSaving: Boolean = false,
    /** Servidor cuya dirección se está editando; `null` cuando no hay edición abierta. */
    val editing: ServerConfig? = null,
    val editInput: String = "",
    val editErrorRes: Int? = null,
    val isSavingEdit: Boolean = false,
)
