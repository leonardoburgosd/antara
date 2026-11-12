package com.antara.app.data.local

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore

/** Instancia única de DataStore para preferencias locales de la app. */
val Context.antaraDataStore: DataStore<Preferences> by preferencesDataStore(name = "antara_preferences")

/** Claves centralizadas de preferencias (sesión, servidores y archivos locales). */
object PreferencesKeys {
    val AUTHENTICATED = booleanPreferencesKey("auth_authenticated")
    val USER_NAME = stringPreferencesKey("auth_user_name")
    val USER_EMAIL = stringPreferencesKey("auth_user_email")

    /**
     * Token del backend. Deuda conocida: DataStore no cifra; migrar al almacén
     * seguro (ver `docs/security.md`) cuando se añada esa dependencia.
     */
    val USER_TOKEN = stringPreferencesKey("auth_user_token")

    /** Email recordado para no reescribirlo al cerrar sesión. Nunca la contraseña. */
    val REMEMBERED_EMAIL = stringPreferencesKey("auth_remembered_email")

    /** Direcciones separadas por salto de línea (ya normalizadas por [com.antara.app.core.network.ServerAddress]). */
    val SERVERS = stringPreferencesKey("servers")
    val ACTIVE_SERVER = stringPreferencesKey("active_server")

    /** Archivos de audio del dispositivo: una entrada `uri<TAB>título` por línea. */
    val LOCAL_AUDIO = stringPreferencesKey("local_audio")
}
