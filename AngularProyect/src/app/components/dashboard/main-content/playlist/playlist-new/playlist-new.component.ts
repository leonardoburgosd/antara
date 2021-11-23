import { Component, OnInit } from '@angular/core';
import { Playlist } from 'src/app/classes/Playlist';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Pista } from 'src/app/classes/Pista';
import { PlaylistService } from 'src/app/services/playlist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-playlist-new',
  templateUrl: './playlist-new.component.html',
  styleUrls: ['./playlist-new.component.css'],
})
export class PlaylistNewComponent implements OnInit {
  imagenUrl: string | ArrayBuffer | null | undefined;
  playlist: Playlist = new Playlist();
  pistas: Pista[] = [];
  usuario: any = {};
  portada!: File;
  constructor(
    private playlistService: PlaylistService,
    private spinner: NgxSpinnerService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.usuario = this.obtieneUsuarioLog();
    this.playlist = this.inicializarPlaylist();
    this.spinner.hide();
  }

  agregarPlaylist() {
    this.spinner.show();
    this.playlistService.registro(this.playlist, this.portada).subscribe(
      (response: any) => {
        this.playlist = response;
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
        this.spinner.hide();
        Swal.fire({
          icon: 'success',
          title: 'Playlist registrada',
          text: 'Se ah registrado la playlist exitosamente.',
        });
        this._router.navigate(['/dashboard/playlist']);
      },
      (error: any) => this.controlError(error)
    );
  }

  //#region complementos

  obtieneUsuarioLog(): any {
    let usuario = JSON.parse(localStorage.getItem('userResponse') as string);
    if (usuario.user == 'google') return usuario.data[1];
    else return usuario.data;
  }

  inicializarPlaylist(): Playlist {
    let newPlaylist: Playlist = new Playlist();
    newPlaylist.nombre = 'Nuevo playist';
    newPlaylist.descripcion = 'Desripcion de la playlist.';
    newPlaylist.portadaUrl = '../../../../assets/images/musica.png';
    newPlaylist.estaActivo = true;
    newPlaylist.usuarioId = this.usuario.id;
    return newPlaylist;
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

  //#endregion
}
