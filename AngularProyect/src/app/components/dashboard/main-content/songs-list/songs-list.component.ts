import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Album } from 'src/app/classes/Album';

@Component({
  selector: 'app-songs-list',
  templateUrl: './songs-list.component.html',
  styleUrls: ['./songs-list.component.css'],
})
export class SongsListComponent implements OnInit {
  @Input()
  album: string = 'album123'; //cambiar a type album
  @Output()
  playAlbum: EventEmitter<String> = new EventEmitter<String>(); //cambiar a type album

  constructor() {}

  ngOnInit(): void {}

  addToPlaylist(event: Event) {
    let icon: string = (<HTMLImageElement>event.target)?.getAttribute('src')!;
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
    }
  }

  play() {
    this.playAlbum.emit(this.album);
    console.log(`Album from pista-displayed: ${this.album}`);
  }
}
