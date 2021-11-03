import { Component, OnInit } from '@angular/core';
import { DataServiceAlbum } from 'src/app/aplication-data/rest/DataServiceAlbum';
import { Album } from 'src/app/aplication-data/structure/Album';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {

  usuario: any = {};
  albums: Album[] = [];
  constructor(private dataService: DataServiceAlbum) { }

  ngOnInit(): void {
    this.usuario = this.obtieneUsuarioLog();
    this.listaMisAlbums(this.usuario.id);
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
    let usuario = JSON.parse(localStorage.getItem('userResponse') as string);
    if (usuario.user == 'google') return usuario.data[1];
    else return usuario.data;
  }

  controlErrores(error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error al guardar los datos.',
      text: error
    });
  }

  //#endregion

}
