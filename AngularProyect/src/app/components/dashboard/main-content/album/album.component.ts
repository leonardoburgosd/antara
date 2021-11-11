import { Component, OnInit } from '@angular/core';

import { Album } from 'src/app/classes/Album';
import { AlbumService } from 'src/app/services/album.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css'],
})
export class AlbumComponent implements OnInit {
  usuario: any = {};
  albums: Album[] = [];
  constructor(private albumService: AlbumService) {}

  ngOnInit(): void {
    this.usuario = this.obtieneUsuarioLog();
    this.listaMisAlbums(this.usuario.id);
  }

  listaMisAlbums(usuarioId: number) {
    this.albumService.obtenerPorUsuario(usuarioId).then(
      (response: any) => {
        this.albums = response;
        console.log(response);
      },
      (err: any) => {
        this.controlErrores(err);
      }
    );
  }

  //#region Complementos

  obtieneUsuarioLog(): any {
    let usuario = JSON.parse(localStorage.getItem('userResponse') as string);
    if (usuario.user == 'google') return usuario.data[1];
    else return usuario.data;
  }

  controlErrores(error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error al guardar los datos.',
      text: error,
    });
  }

  //#endregion
}
