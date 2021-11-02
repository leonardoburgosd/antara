import { Component, OnInit } from '@angular/core';
import { DataServiceAlbum } from 'src/app/aplication-data/rest/DataServiceAlbum';
import { Album } from 'src/app/aplication-data/structure/Album';

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
