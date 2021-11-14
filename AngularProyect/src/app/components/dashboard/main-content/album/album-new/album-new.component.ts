import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

import { Album } from 'src/app/classes/Album';
import { Pista } from 'src/app/classes/Pista';
import { AlbumService } from 'src/app/services/album.service';
import { PistasService } from 'src/app/services/pistas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-album-new',
  templateUrl: './album-new.component.html',
  styleUrls: ['./album-new.component.css'],
})
export class AlbumNewComponent implements OnInit {
  usuario: any = {};
  album: Album = new Album();
  pista: Pista = new Pista();
  pistas: Pista[] = [];
  portada!: File;
  audio!: File;
  imagenUrl: string | ArrayBuffer | null | undefined;
  constructor(
    private albumService: AlbumService,
    private pistaService: PistasService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.usuario = this.obtieneUsuarioLog();
    this.album = this.inicializaNuevoAlbum();
    this.spinner.hide();
  }

  registrarPlaylistBorrador() {
    this.spinner.show();
    this.albumService.registro(this.album, this.portada).subscribe(
      (response: any) => {
        this.album = response;
        setTimeout(() => {
          /** spinner ends after 5 seconds */
          this.spinner.hide();
        }, 500);
        this.spinner.hide();
        Swal.fire({
          icon: 'success',
          title: 'Album registrado',
          text: 'Se ah registrado el album exitosamente',
        });
        //this.router.navigate(['/dashboard/album']);
      },
      (error: any) => {
        this.spinner.hide();
        this.controlError(error);
      }
    );
  }

  guardarAudio() {
    this.spinner.show();
    this.pista.albumId = this.album.id;
    this.pistaService.registro(this.pista, this.audio).then(
      (response: any) => this.listaPistas(),
      (error: any) => { this.controlError(error); this.spinner.hide(); }
    );
  }

  listaPistas() {
    this.pistaService.listaPorAlbum(this.album.id).then(
      (response: any) => { this.pistas = response; this.spinner.hide(); },
      (error: any) => { this.controlError(error); this.spinner.hide(); }
    );
  }

  //#region Complementos

  inicializaNuevoAlbum(): Album {
    let newAlbum: Album = new Album();
    newAlbum.nombre = 'Mi playlist';
    newAlbum.descripcion = 'Descripcion de la playlist.';
    newAlbum.portadaUrl = '../../../../assets/images/musica.png';
    newAlbum.estaActivo = true;
    newAlbum.usuarioId = this.usuario.id;
    return newAlbum;
  }

  controlError(err: any) {
    if (err.status == 1) {
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: err.mensaje,
      });
    } else if (err.status == 500) {
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'Por favor revise su conexión de internet.',
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
      reader.onload = (event) =>
        (this.imagenUrl = (<FileReader>event.target).result);
    }
  }

  seleccionaAudio(evento: any) {
    this.audio = <File>evento.target.files[0];
  }
  //#endregion
}
