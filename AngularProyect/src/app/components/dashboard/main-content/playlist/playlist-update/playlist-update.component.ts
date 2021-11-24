import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import { Pista } from 'src/app/classes/Pista';
import { Playlist } from 'src/app/classes/Playlist';
import { PlaylistService } from 'src/app/services/playlist.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-playlist-update',
  templateUrl: './playlist-update.component.html',
  styleUrls: ['./playlist-update.component.css']
})
export class PlaylistUpdateComponent implements OnInit {
  imagenUrl: string | ArrayBuffer | null | undefined;
  playlist: Playlist = new Playlist();
  pistas: Pista[] = [];
  usuario: any = {};
  portada!: File;

  constructor(private playlistService: PlaylistService, private spinner: NgxSpinnerService,
    private route: ActivatedRoute, private _router: Router) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let parametro = params.get('playlistId');
      this.playlist.id = parametro != null && parametro != undefined ? parametro : '';
    });
  }
  ngOnInit(): void {
    this.spinner.show();
    this.usuario = this.obtieneUsuarioLog();
    this.detallePlaylist(this.playlist.id);
    this.spinner.hide();
  }

  actualizarPlaylist() {
    this.playlistService.actualizar(this.playlist).subscribe(
      (response: any) => console.log(response),
      (error: any) => this.controlError(error)
    );
  }


  //#region complementos

  obtieneUsuarioLog(): any {
    let usuario = JSON.parse(localStorage.getItem('userResponse') as string);
    if (usuario.user == 'google') return usuario.data[1];
    else return usuario.data;
  }

  detallePlaylist(playlisId: string) {
    forkJoin([
      this.playlistService.detalle(playlisId),
    ]).subscribe((result) => {
      this.playlist = result[0] as Playlist;
    });
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
