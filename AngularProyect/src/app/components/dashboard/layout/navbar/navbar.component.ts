import { Component, OnInit } from '@angular/core';
import { Playlist } from 'src/app/classes/Playlist';
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(private _playlistService: PlaylistService) {}
  favPlaylist: Playlist = new Playlist();
  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('userResponse') as string);
    this._playlistService.listaPorUsuario(usuario.data.id).subscribe(
      (data: Playlist[]) => (this.favPlaylist = data[0]),
      (err) => console.log(err)
    );
  }
}
