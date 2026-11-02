package com.antara.app.domain.repository

import com.antara.app.domain.model.LocalAudio
import kotlinx.coroutines.flow.StateFlow

/** Archivos de audio del dispositivo que el usuario añade a su biblioteca. */
interface LocalAudioRepository {
    val files: StateFlow<List<LocalAudio>>

    /** Añade los URIs seleccionados (persistidos entre sesiones). */
    suspend fun add(uris: List<String>)

    /** Quita un archivo de la biblioteca (no borra el archivo del dispositivo). */
    suspend fun remove(uri: String)
}
