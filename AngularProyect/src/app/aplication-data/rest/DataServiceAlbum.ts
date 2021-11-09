import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Album } from "../structure/Album";

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    }),
    Authorization: "Bearer "
};

@Injectable({
    providedIn: 'root'
})

export class DataServiceAlbum {
    private API: string;
    constructor(private httpClient: HttpClient) {
        //this.API = 'https://localhost:44392/api/album';
        this.API ='https://apislatch.azurewebsites.net/api/album';
    }

    registro(album: Album, portada:File): any {
        let data:FormData = new FormData();
        data.append('Nombre', album.nombre);
        data.append('Descripcion', album.descripcion);
        data.append('UsuarioId', album.usuarioId);
        data.append('File', portada);
        return this.httpClient.post(this.API, data).toPromise();
    }

    actualizar(album: Album): any {
        return this.httpClient.put(this.API, album, httpOptions).toPromise();
    }

    obtenerPorUsuario(usuarioId: number): any {
        return this.httpClient.get(this.API + "/todos/" + usuarioId, httpOptions).toPromise();
    }

    detalle(albumId: string): any {
        return this.httpClient.get(this.API + "/" + albumId, httpOptions).toPromise();
    }

    eliminar(albumId: string): any {
        return this.httpClient.delete(this.API + "/" + albumId, httpOptions).toPromise();
    }

    publicar(albumId: string): any {
        this.httpClient.put('https://localhost:44392/api/publicar', null, httpOptions).toPromise();
    }
}
