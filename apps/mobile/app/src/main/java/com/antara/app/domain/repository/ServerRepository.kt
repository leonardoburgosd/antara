package com.antara.app.domain.repository

import com.antara.app.domain.model.SavedServers
import kotlinx.coroutines.flow.Flow

/** Contrato de los servidores configurados por el usuario. */
interface ServerRepository {
    val servers: Flow<SavedServers>

    suspend fun add(address: String): Result<Unit>

    suspend fun remove(address: String)

    suspend fun setActive(address: String)

    /** Cambia la dirección de un servidor guardado, conservando su posición y estado activo. */
    suspend fun update(oldAddress: String, newAddress: String): Result<Unit>
}
