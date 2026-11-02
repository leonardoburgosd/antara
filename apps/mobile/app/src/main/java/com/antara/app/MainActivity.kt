package com.antara.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.antara.app.core.designsystem.AntaraTheme
import com.antara.app.navigation.AppRoot

class MainActivity : ComponentActivity() {

    private val container: AppContainer
        get() = (application as AntaraApplication).container

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            AntaraTheme {
                AppRoot(container = container)
            }
        }
    }

    override fun onStart() {
        super.onStart()
        // La UI se conecta a la MediaSession al volver a primer plano.
        container.playerConnection.connect()
    }

    override fun onStop() {
        // Libera el controller; el servicio sigue reproduciendo en segundo plano.
        container.playerConnection.disconnect()
        super.onStop()
    }
}
