import { Component, OnInit } from '@angular/core';
import { Album } from 'src/app/classes/Album';

import { ActivatedRoute, ParamMap } from '@angular/router';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Pista } from 'src/app/classes/Pista';
import { PistasService } from 'src/app/services/pistas.service';
import { AlbumService } from 'src/app/services/album.service';

@Component({
  selector: 'app-album-update',
  templateUrl: './album-update.component.html',
  styleUrls: ['./album-update.component.css'],
})
export class AlbumUpdateComponent implements OnInit {
  usuario: any = {};
  albumId: string = '';
  imagenUrl: string | ArrayBuffer | null | undefined;
  album: Album = new Album();
  pistas: Pista[] = [];
  pista: Pista = new Pista();
  audio!: File;
  portada!: File;

  constructor(
    private pistaService: PistasService,
    private albumService: AlbumService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let parametro = params.get('albumId');
      this.albumId =
        parametro != null && parametro != undefined ? parametro : '';
    });
  }

  ngOnInit(): void {
    this.spinner.show();
    this.usuario = this.obtieneUsuarioLog();
    this.detalleAlbum(this.albumId);
  }

  guardarAudio() {
    this.spinner.show();
    this.pista.albumId = this.album.id;
    this.pistaService.registro(this.pista, this.audio).then(
      (response: any) => {
        this.pistaService.listaPorAlbum(this.albumId).then(
          (response: Pista[]) => {
            this.pistas = response;
          },
          (error: any) => this.controlError(error)
        );
        this.spinner.hide();
      },
      (error: any) => this.controlError(error)
    );
  }

  //#region Complementos

  registrarPlaylistBorrador() {
    this.albumService.registro(this.album, this.portada).then(
      (response: any) => {
        this.album = response;
      },
      (error: any) => {
        this.controlError(error);
      }
    );
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

  seleccionaImagen(evento: any) {
    this.portada = <File>evento.target.files[0];
  }

  detalleAlbum(albumId: string) {
    this.spinner.show();
    forkJoin([
      this.albumService.detalle(albumId),
      this.pistaService.listaPorAlbum(albumId),
    ]).subscribe((result) => {
      this.album = result[0] as Album;
      this.pistas = result[1] as Pista[];
    });
    this.spinner.hide();
  }

  obtieneUsuarioLog(): any {
    let usuario = JSON.parse(localStorage.getItem('userResponse') as string);
    if (usuario.user == 'google') return usuario.data[1];
    else return usuario.data;
  }

  //#endregion
}
