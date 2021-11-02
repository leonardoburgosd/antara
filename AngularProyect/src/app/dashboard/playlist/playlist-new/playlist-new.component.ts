import { Component, OnInit } from '@angular/core';
import { Album } from 'src/app/aplication-data/structure/Album';
import { Pista } from 'src/app/aplication-data/structure/Pista';
import { DataServiceAlbum } from 'src/app/aplication-data/rest/DataServiceAlbum';

@Component({
  selector: 'app-playlist-new',
  templateUrl: './playlist-new.component.html',
  styleUrls: ['./playlist-new.component.css']
})
export class PlaylistNewComponent implements OnInit {
  usuario: any = {};
  album: Album = new Album();
  pistas: Pista[] = [];
  constructor(private dataService: DataServiceAlbum) { }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('userResponse') as string);
    this.album = this.inicializaNuevoAlbum();
  }


  inicializaNuevoAlbum(): Album {
    let newAlbum: Album = new Album();
    newAlbum.nombre = "Mi playlist";
    newAlbum.descripcion = "Descripcion de la playlist.";
    newAlbum.portadaUrl = "../../../../assets/images/musica.png";
    newAlbum.estaActivo = true;
    newAlbum.usuarioId = this.usuario.data.id;
    debugger
    return newAlbum;
  }

  registrarPlaylistBorrador() {
    this.dataService.registro(this.album).then((response: any) => { console.log(response); }, (error: any) => { console.log(error); });
  }

}
