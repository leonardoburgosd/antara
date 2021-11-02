import { Component, OnInit } from '@angular/core';
import { DataServiceAlbum } from 'src/app/aplication-data/rest/DataServiceAlbum';
import { Album } from 'src/app/aplication-data/structure/Album';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  usuario: any = {};
  albums: Album[] = [];
  constructor(private dataService: DataServiceAlbum) { }

  ngOnInit(): void {
    this.usuario = this.obtieneUsuarioLog();
    this.listaMisAlbums(this.usuario.data.id);
  }

  listaMisAlbums(usuarioId: number) {
    this.dataService.obtenerPorUsuario(usuarioId).then(
      (response: any) => {
        this.albums = response;
      }, (err: any) => {
        this.controlErrores(err);
      });
  }

  //#region Complementos

  obtieneUsuarioLog(): any {
    return JSON.parse(localStorage.getItem('userResponse') as string);
  }

  controlErrores(error: any) {

  }

  //#endregion

}
