package com.antara.app

import android.app.Application

/** Application dueña del contenedor de dependencias manual. */
class AntaraApplication : Application() {

    lateinit var container: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()
        container = AppContainer(this)
    }
}
