import { Component, Input, OnInit } from '@angular/core';
import { Album } from 'src/app/classes/Album';

@Component({
  selector: 'app-card-album',
  templateUrl: './card-album.component.html',
  styleUrls: ['./card-album.component.css'],
})
export class CardAlbumComponent implements OnInit {
  @Input() album: Album = new Album();
  constructor() {}

  ngOnInit(): void {}
}
