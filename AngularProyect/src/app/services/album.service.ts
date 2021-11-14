import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Album } from '../classes/Album';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  Authorization: 'Bearer ',
};

@Injectable({
  providedIn: 'root',
})
export class AlbumService {
  private API: string;
  constructor(private httpClient: HttpClient) {
    //this.API = 'https://localhost:44392/api/album';
    this.API = 'https://apislatch.azurewebsites.net/api/album';
  }

  registro(album: Album, portada: File): Observable<any> {
    let data: FormData = new FormData();
    data.append('Nombre', album.nombre);
    data.append('Descripcion', album.descripcion);
    data.append('UsuarioId', album.usuarioId);
    data.append('imagenDePortada', portada);
    console.log(portada);
    return this.httpClient.post(this.API, data);
  }

  actualizar(album: Album): any {
    return this.httpClient.put(this.API, album, httpOptions).toPromise();
  }

  obtenerPorUsuario(usuarioId: number): Observable<any> {
    return this.httpClient.get(this.API + '/todos/' + usuarioId, httpOptions);
  }

  detalle(albumId: string): Observable<any> {
    return this.httpClient.get(this.API + '/' + albumId, httpOptions);
  }

  eliminar(albumId: string): Observable<any> {
    return this.httpClient.delete(`${this.API}/${albumId}`, httpOptions);
  }

  publicar(albumId: string): any {
    this.httpClient.put(`${this.API}/publicar/${albumId}`, null, httpOptions);
  }
}
