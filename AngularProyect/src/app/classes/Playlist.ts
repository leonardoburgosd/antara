export class Playlist {
    id!: string;
    nombre!: string;
    descripcion!: string;
    usuarioId!: string;
    portadaUrl!: string;
    estaActivo!: Boolean;
    fechaRegistro!: Date;
}

export class PlaylistPista {
    playlistId!: string;
    pistaId!: string
    fechaRegistro!: Date;
}
