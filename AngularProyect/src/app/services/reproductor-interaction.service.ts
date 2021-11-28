import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Album } from '../classes/Album';
import { Pista } from '../classes/Pista';
import { Playlist } from '../classes/Playlist';

@Injectable({
  providedIn: 'root',
})
export class ReproductorInteractionService {
  private pistasSource = new Subject<any>();
  private tableSource = new Subject<number>();
  private pauseSource = new Subject<null>();
  tableIndex$ = this.tableSource.asObservable();
  pistas$ = this.pistasSource.asObservable();
  pause$ = this.pauseSource.asObservable();
  constructor() {}

  playAlbum(album: {
    pistas: Pista[];
    album: Album | Playlist;
    songIndex: number;
  }) {
    this.pistasSource.next(album);
  }

  paintRow(index: number) {
    this.tableSource.next(index);
  }

  pauseSong() {
    this.pauseSource.next();
  }
}
