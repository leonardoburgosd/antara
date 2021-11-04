import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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

  constructor() {}

  getAll(): Observable<any[]> {
    return of(this.data);
  }
}
