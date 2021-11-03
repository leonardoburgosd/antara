import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { DataServiceAlbum } from 'src/app/aplication-data/rest/DataServiceAlbum';
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
  pistas: Pista[] = [];
  file!: File;
  imagenUrl: string | ArrayBuffer | null | undefined;
  constructor(private dataService: DataServiceAlbum) { }

  ngOnInit(): void {
    this.usuario = this.obtieneUsuarioLog();
    this.album = this.inicializaNuevoAlbum();
  }


  inicializaNuevoAlbum(): Album {
    let newAlbum: Album = new Album();
    newAlbum.nombre = "Mi playlist";
    newAlbum.descripcion = "Descripcion de la playlist.";
    newAlbum.portadaUrl = "../../../../assets/images/musica.png";
    newAlbum.estaActivo = true;
    newAlbum.usuarioId = this.usuario.id;
    return newAlbum;
  }

  registrarPlaylistBorrador() {
    this.dataService.registro(this.album, this.file).then(
      (response: any) => { this.album = response; },
      (error: any) => { this.controlError(error); }
    );
  }

  //#region Complementos
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
    debugger
    let usuario = JSON.parse(localStorage.getItem('userResponse') as string);
    if (usuario.user == 'google') return usuario.data[1];
    else return usuario.data;
  }

  seleccionaImagen(evento: any) {
    console.log(evento);
    this.file = <File>evento.target.files[0];
  }

  mostrarImagen() {
    if (this.file != null) {
      var reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = (event) => this.imagenUrl = (<FileReader>event.target).result;
    } else {
      this.controlError({ error: { status: 1, mensaje: 'No se ah seleccionado ninguna imagen.' } });
    }
  }

  //#endregion
}
