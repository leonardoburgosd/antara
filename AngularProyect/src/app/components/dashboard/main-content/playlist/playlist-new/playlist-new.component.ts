import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-playlist-new',
  templateUrl: './playlist-new.component.html',
  styleUrls: ['./playlist-new.component.css']
})
export class PlaylistNewComponent implements OnInit {
  imagenUrl: string | ArrayBuffer | null | undefined;
  constructor() { }

  ngOnInit(): void {
  }

}
