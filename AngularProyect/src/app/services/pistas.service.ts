import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Pista } from '../classes/Pista';
import { Observable, of } from 'rxjs';

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
  data = [
    {
      nombre: 'The Leyend of Zelda Theme',
      interprete: 'Kōji Kondō',
      portadaAlbum: '../../../assets/images/zelda.jpg',
      url: 'assets/audio/zelda_main_theme.mp3',
    },
    {
      nombre: 'Welcome to the jungle',
      interprete: "Guns N' Roses",
      portadaAlbum: '../../../assets/images/apettite_for_destruction.jpg',
      url: 'assets/audio/welcome_to_the_jungle.mp3',
    },
    {
      nombre: 'Shake it off',
      interprete: 'Taylor Swift',
      portadaAlbum: '../../../assets/images/1989.jpg',
      url: 'assets/audio/shake_it_off.mp3',
    },
  ];

  private API: string;
  constructor(private httpClient: HttpClient) {
    //this.API = 'https://localhost:44392/api/pista';
    this.API = 'https://apislatch.azurewebsites.net/api/pista';
  }

  registro(pista: Pista, audio: File): any {
    let data: FormData = new FormData();
    data.append('AnoCreacion', pista.anoCreacion.toString());
    data.append('Interprete', pista.interprete);
    data.append('Compositor', pista.compositor);
    data.append('Productor', pista.productor);
    data.append('GeneroId', pista.generoId.toString());
    data.append('AlbumId', pista.albumId);
    data.append('archivo', audio);
    return this.httpClient.post(this.API, data).toPromise();
  }

  listaPorAlbum(albumId: string): any {
    return this.httpClient
      .get(this.API + '/todos/album/' + albumId, httpOptions)
      .toPromise();
  }

  getAll(): Observable<any[]> {
    return of(this.data);
  }

  eliminar(pistaId:string):any{
    return this.httpClient.delete(this.API+'/'+pistaId).toPromise();
  }
}
