import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Album } from '../classes/Album';
import { Pista } from '../classes/Pista';

@Injectable({
  providedIn: 'root',
})
export class ReproductorInteractionService {
  private pistasSource = new Subject<any>();
  pistas$ = this.pistasSource.asObservable();
  constructor() {}

  playAlbum(album: {
    pistas: Pista[];
    portadaAlbum: string;
    songIndex: number;
  }) {
    this.pistasSource.next(album);
  }
}
