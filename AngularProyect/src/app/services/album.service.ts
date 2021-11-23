import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Album } from '../classes/Album';
import { Observable } from 'rxjs';
import { Utilities } from '../shared/utilities';

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
  private API: string = new Utilities().apiUrl;
  constructor(private httpClient: HttpClient) {
    this.API = `${this.API}/api/album`;
  }

  registro(album: Album, portada: File): Observable<any> {
    let data: FormData = new FormData();
    data.append('Nombre', album.nombre);
    data.append('Descripcion', album.descripcion);
    data.append('UsuarioId', album.usuarioId);
    data.append('Interprete', album.interprete);
    data.append('imagenDePortada', portada);
    return this.httpClient.post(this.API, data);
  }

  actualizar(album: Album): Observable<any> {
    return this.httpClient.put(this.API + '?id=' + album.id, album);
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

  publicar(albumId: string): Observable<any> {
    return this.httpClient.put(`${this.API}/publicar/${albumId}`, null);
  }

  obtenerHechoEnPeru(): Observable<any> {
    return this.httpClient.get(`${this.API}/todos/hecho_en_peru`, httpOptions);
  }
}
