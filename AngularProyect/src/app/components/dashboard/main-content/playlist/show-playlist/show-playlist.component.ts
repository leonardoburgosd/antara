import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Album } from 'src/app/classes/Album';
import { Pista } from 'src/app/classes/Pista';
import { PistasService } from 'src/app/services/pistas.service';

@Component({
  selector: 'app-show-playlist',
  templateUrl: './show-playlist.component.html',
  styleUrls: ['./show-playlist.component.css'],
})
export class ShowPlaylistComponent implements OnInit {
  album: Album = new Album();
  pistas: Pista[] = [];
  constructor(private _pistaService: PistasService) {}

  ngOnInit(): void {
    this.album = JSON.parse(localStorage.getItem('albumToPlay') as string).data;
    this._pistaService.listaPorAlbum(this.album.id).subscribe(
      (data: Pista[]) => {
        this.pistas = data;
        console.log(this.pistas);
      },
      (err: any) => console.log(err)
    );
  }

  addToPlaylist(event: Event) {
    /* let icon: string = (<HTMLImageElement>event.target)?.getAttribute('src')!;
    if (icon.includes('blanco')) {
      (<HTMLImageElement>event.target)?.setAttribute(
        'src',
        icon.replace('blanco', 'color')
      );
    } else {
      (<HTMLImageElement>event.target)?.setAttribute(
        'src',
        icon.replace('color', 'blanco')
      );
    } */
  }
  pauseSong(index: number) {}
  playSong(index: number) {
    /* this.playAlbum.emit(this.album);
    console.log(`Album from pista-displayed: ${this.album}`); */
  }
}
