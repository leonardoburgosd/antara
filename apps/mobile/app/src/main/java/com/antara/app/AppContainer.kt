package com.antara.app

import android.content.Context
import com.antara.app.data.local.LocalAudioRepositoryImpl
import com.antara.app.data.local.ServerRepositoryImpl
import com.antara.app.data.local.SessionRepositoryImpl
import com.antara.app.data.remote.AlbumApi
import com.antara.app.data.remote.AuthApi
import com.antara.app.data.remote.LyricsApi
import com.antara.app.data.remote.PlaylistApi
import com.antara.app.domain.repository.LocalAudioRepository
import com.antara.app.domain.repository.ServerRepository
import com.antara.app.domain.repository.SessionRepository
import com.antara.app.player.PlayerConnection

/**
 * Contenedor de dependencias manual (ADR-006).
 * Sin singletons con estado fuera del contenedor.
 */
class AppContainer(context: Context) {
    private val applicationContext = context.applicationContext

    val sessionRepository: SessionRepository = SessionRepositoryImpl(applicationContext)
    val serverRepository: ServerRepository = ServerRepositoryImpl(applicationContext)
    val localAudioRepository: LocalAudioRepository = LocalAudioRepositoryImpl(applicationContext)
    val authApi = AuthApi()
    val albumApi = AlbumApi()
    val playlistApi = PlaylistApi()
    val lyricsApi = LyricsApi()
    val playerConnection = PlayerConnection(applicationContext)
}
