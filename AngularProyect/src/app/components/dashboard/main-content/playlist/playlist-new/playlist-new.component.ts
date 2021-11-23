import { Component, OnInit } from '@angular/core';
import { Playlist } from 'src/app/classes/Playlist';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Pista } from 'src/app/classes/Pista';

@Component({
  selector: 'app-playlist-new',
  templateUrl: './playlist-new.component.html',
  styleUrls: ['./playlist-new.component.css']
})
export class PlaylistNewComponent implements OnInit {
  imagenUrl: string | ArrayBuffer | null | undefined;
  playlist: Playlist = new Playlist();
  pistas: Pista[] = [];
  usuario: any = {};
  portada!: File;
  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.usuario = this.obtieneUsuarioLog();
    this.playlist = this.inicializarPlaylist();
    this.spinner.hide();
  }

  agregarPlaylist() {

  }


  //#region complementos
  obtieneUsuarioLog(): any {
    let usuario = JSON.parse(localStorage.getItem('userResponse') as string);
    if (usuario.user == 'google') return usuario.data[1];
    else return usuario.data;
  }

  inicializarPlaylist(): Playlist {
    let newPlaylist: Playlist = new Playlist();
    newPlaylist.nombre = "Nuevo playist";
    newPlaylist.descripcion = "Desripcion de la playlist.";
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
  //#endregion
}
