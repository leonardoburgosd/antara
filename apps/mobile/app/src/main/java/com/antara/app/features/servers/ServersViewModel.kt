package com.antara.app.features.servers

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.antara.app.R
import com.antara.app.core.network.ServerAddress
import com.antara.app.domain.repository.ServerRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

/** ViewModel de la lista de servidores (IP/dominios) y su selección activa. */
class ServersViewModel(
    private val repository: ServerRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(ServersUiState())
    val uiState: StateFlow<ServersUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            repository.servers.collect { saved ->
                _uiState.update {
                    it.copy(
                        servers = saved.servers,
                        active = saved.active,
                        isSaving = false,
                    )
                }
            }
        }
    }

    fun onInputChange(value: String) {
        _uiState.update { it.copy(input = value, errorRes = null) }
    }

    fun addServer() {
        val state = _uiState.value
        if (state.isSaving) return

        val raw = state.input.trim()
        if (raw.isEmpty()) {
            _uiState.update { it.copy(errorRes = R.string.servers_error_empty) }
            return
        }

        val normalized = ServerAddress.normalize(raw)
        if (normalized == null) {
            _uiState.update { it.copy(errorRes = R.string.servers_error_invalid) }
            return
        }

        if (state.servers.any { it.address.equals(normalized, ignoreCase = true) }) {
            _uiState.update { it.copy(errorRes = R.string.servers_error_duplicate) }
            return
        }

        _uiState.update { it.copy(isSaving = true, errorRes = null) }
        viewModelScope.launch {
            repository.add(normalized)
                .onSuccess {
                    _uiState.update { it.copy(input = "", isSaving = false) }
                }
                .onFailure {
                    _uiState.update {
                        it.copy(isSaving = false, errorRes = R.string.servers_error_save)
                    }
                }
        }
    }

    fun removeServer(address: String) {
        viewModelScope.launch { repository.remove(address) }
    }

    fun setActive(address: String) {
        viewModelScope.launch { repository.setActive(address) }
    }

    /** Abre la edición de la dirección de un servidor guardado. */
    fun startEdit(address: String) {
        val server = _uiState.value.servers.firstOrNull {
            it.address.equals(address, ignoreCase = true)
        } ?: return
        _uiState.update {
            it.copy(
                editing = server,
                editInput = server.displayName,
                editErrorRes = null,
                isSavingEdit = false,
            )
        }
    }

    fun onEditInputChange(value: String) {
        _uiState.update { it.copy(editInput = value, editErrorRes = null) }
    }

    fun cancelEdit() {
        if (_uiState.value.isSavingEdit) return
        _uiState.update {
            it.copy(
                editing = null,
                editInput = "",
                editErrorRes = null,
                isSavingEdit = false,
            )
        }
    }

    fun saveEdit() {
        val state = _uiState.value
        val editing = state.editing ?: return
        if (state.isSavingEdit) return

        val raw = state.editInput.trim()
        if (raw.isEmpty()) {
            _uiState.update { it.copy(editErrorRes = R.string.servers_error_empty) }
            return
        }

        val normalized = ServerAddress.normalize(raw)
        if (normalized == null) {
            _uiState.update { it.copy(editErrorRes = R.string.servers_error_invalid) }
            return
        }

        if (normalized.equals(editing.address, ignoreCase = true)) {
            cancelEdit()
            return
        }

        val duplicate = state.servers.any { server ->
            !server.address.equals(editing.address, ignoreCase = true) &&
                server.address.equals(normalized, ignoreCase = true)
        }
        if (duplicate) {
            _uiState.update { it.copy(editErrorRes = R.string.servers_error_duplicate) }
            return
        }

        _uiState.update { it.copy(isSavingEdit = true, editErrorRes = null) }
        viewModelScope.launch {
            repository.update(editing.address, normalized)
                .onSuccess {
                    _uiState.update {
                        it.copy(
                            editing = null,
                            editInput = "",
                            editErrorRes = null,
                            isSavingEdit = false,
                        )
                    }
                }
                .onFailure {
                    _uiState.update {
                        it.copy(
                            isSavingEdit = false,
                            editErrorRes = R.string.servers_error_save,
                        )
                    }
                }
        }
    }

    companion object {
        fun factory(repository: ServerRepository) = viewModelFactory {
            initializer { ServersViewModel(repository) }
        }
    }
}
