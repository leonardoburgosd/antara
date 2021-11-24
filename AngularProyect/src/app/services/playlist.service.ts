import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Playlist, PlaylistPista } from '../classes/Playlist';
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
export class PlaylistService {
  private API: string = new Utilities().apiUrl;
  constructor(private httpClient: HttpClient) {
    this.API = `${this.API}/api/playlist`;
  }

  registro(playlist: Playlist, portada: File): Observable<any> {
    let data: FormData = new FormData();
    data.append('Nombre', playlist.nombre);
    data.append('Descripcion', playlist.descripcion);
    data.append('UsuarioId', playlist.usuarioId);
    data.append('imagenDePortada', portada);
    return this.httpClient.post(this.API, data);
  }

  detalle(playlistId: string): Observable<any> {
    return this.httpClient.get(this.API + '/' + playlistId);
  }

  listaPorUsuario(usuarioId: string): Observable<any> {
    return this.httpClient.get(this.API + '/todos/' + usuarioId);
  }

  actualizar(playlist: Playlist, portada:File): Observable<any> {
    debugger
    let data: FormData = new FormData();
    data.append('Nombre', playlist.nombre);
    data.append('Descripcion', playlist.nombre);
    data.append('imagenDePortada', portada);

    return this.httpClient.put(this.API + '?id=' + playlist.id, playlist);
  }

  eliminar(playlistId: string): Observable<any> {
    return this.httpClient.delete(this.API + '/' + playlistId);
  }

  agregarPistaPlaylist(playlist: PlaylistPista) {
    return this.httpClient.post(this.API + '/agregar', playlist,httpOptions).toPromise();
  }

  eliminarPlaylistPista(playlistPista: PlaylistPista): any {
    //return this.httpClient.delete(this.API+'/agregar', playlistPista).toPromise();
  }
}
