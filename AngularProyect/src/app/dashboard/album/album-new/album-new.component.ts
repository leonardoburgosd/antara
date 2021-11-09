import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { DataServiceAlbum } from 'src/app/aplication-data/rest/DataServiceAlbum';
import { DataServicePistas } from 'src/app/aplication-data/rest/DataServicePistas';
import { Album } from 'src/app/aplication-data/structure/Album';
import { Pista } from 'src/app/aplication-data/structure/Pista';

@Component({
  selector: 'app-album-new',
  templateUrl: './album-new.component.html',
  styleUrls: ['./album-new.component.css']
})
export class AlbumNewComponent implements OnInit {
  usuario: any = {};
  album: Album = new Album();
  pista: Pista = new Pista();
  pistas: Pista[] = [];
  portada!: File;
  audio!: File;
  imagenUrl: string | ArrayBuffer | null | undefined;
  constructor(private dataServiceAlbum: DataServiceAlbum, private dataServicePista: DataServicePistas) { }

  ngOnInit(): void {
    this.usuario = this.obtieneUsuarioLog();
    this.album = this.inicializaNuevoAlbum();
  }

  registrarPlaylistBorrador() {
    this.dataServiceAlbum.registro(this.album, this.portada).then(
      (response: any) => { this.album = response; },
      (error: any) => { this.controlError(error); }
    );
  }

  guardarAudio() {
    this.pista.albumId = this.album.id;
    this.dataServicePista.registro(this.pista, this.audio).then(
      (response: any) => console.log(response),
      (error: any) => this.controlError(error)
    );
  }

  //#region Complementos

  inicializaNuevoAlbum(): Album {
    let newAlbum: Album = new Album();
    newAlbum.nombre = "Mi playlist";
    newAlbum.descripcion = "Descripcion de la playlist.";
    newAlbum.portadaUrl = "../../../../assets/images/musica.png";
    newAlbum.estaActivo = true;
    newAlbum.usuarioId = this.usuario.id;
    return newAlbum;
  }

  controlError(err: any) {
    if (err.status == 1) {
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: err.mensaje
      });
    }
    else if (err.status == 500) {
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'Por favor revise su conexión de internet.'
      });
    }
  }

  obtieneUsuarioLog(): any {
    let usuario = JSON.parse(localStorage.getItem('userResponse') as string);
    if (usuario.user == 'google') return usuario.data[1];
    else return usuario.data;
  }

  seleccionaImagen(evento: any) {
    this.portada = <File>evento.target.files[0];
  }

  mostrarImagen() {
    if (this.portada != null) {
      var reader = new FileReader();
      reader.readAsDataURL(this.portada);
      reader.onload = (event) => this.imagenUrl = (<FileReader>event.target).result;
    }
  }

  seleccionaAudio(evento: any) {
    this.audio = <File>evento.target.files[0];
  }
  //#endregion

}
