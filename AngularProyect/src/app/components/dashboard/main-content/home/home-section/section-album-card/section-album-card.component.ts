import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Album } from 'src/app/classes/Album';

@Component({
  selector: 'app-section-album-card',
  templateUrl: './section-album-card.component.html',
  styleUrls: ['./section-album-card.component.css'],
})
export class SectionAlbumCardComponent implements OnInit {
  @Input() album: Album = new Album();
  constructor(private _router: Router) {}

  ngOnInit(): void {}
  playAlbum() {
    localStorage.setItem(
      'albumToPlay',
      JSON.stringify({ user: 'antara', data: this.album })
    );
    console.log(this._router.navigate(['dashboard/play', this.album.id]));
  }
}
