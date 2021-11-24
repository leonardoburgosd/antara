import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Pista } from '../classes/Pista';
import { Observable, of } from 'rxjs';
import { Utilities } from '../shared/utilities';
import { PlaylistPista } from '../classes/Playlist';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  Authorization: 'Bearer ',
};

@Injectable({
  providedIn: 'root',
})
export class PistasService {
  private API: string = new Utilities().apiUrl;
  constructor(private httpClient: HttpClient) {
    this.API = `${this.API}/api/pista`;
  }

  registro(pista: Pista, audio: File): Observable<any> {
    let data: FormData = new FormData();
    data.append('AnoCreacion', pista.anoCreacion.toString());
    data.append('Interprete', pista.interprete);
    data.append('Compositor', pista.compositor);
    data.append('Productor', pista.productor);
    data.append('GeneroId', pista.generoId.toString());
    data.append('Duracion', pista.duracion.toFixed(0));
    data.append('AlbumId', pista.albumId);
    data.append('archivo', audio);
    return this.httpClient.post(this.API, data);
  }

  listaPorAlbum(albumId: string): Observable<any> {
    return this.httpClient.get(
      this.API + '/todos/album/' + albumId,
      httpOptions
    );
  }

  listaPorPlaylist(playlistId: string): Observable<any> {
    return this.httpClient.get(
      `${this.API}/todos/playlist/${playlistId}`,
      httpOptions
    );
  }

  eliminar(pistaId: string): any {
    return this.httpClient.delete(this.API + '/' + pistaId).toPromise();
  }

  buscar(cadena: string): any {
    return this.httpClient
      .get(this.API + '/buscar?cadena=' + cadena)
      .toPromise();
  }


}
