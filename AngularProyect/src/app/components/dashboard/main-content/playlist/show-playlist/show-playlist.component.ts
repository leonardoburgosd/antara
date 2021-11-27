import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { Album } from 'src/app/classes/Album';
import { Pista } from 'src/app/classes/Pista';
import { Playlist, PlaylistPista } from 'src/app/classes/Playlist';
import { PistasService } from 'src/app/services/pistas.service';
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
  selector: 'app-show-playlist',
  templateUrl: './show-playlist.component.html',
  styleUrls: ['./show-playlist.component.css'],
})
export class ShowPlaylistComponent implements OnInit {
  album: Album = new Album();
  usuario: any = {};
  pistas: Pista[] = [];
  misPlaylist: Playlist[] = [];

  constructor(
    private _pistaService: PistasService,
    private _playlistServices: PlaylistService
  ) {}

  ngOnInit(): void {
    this.usuario = this.obtieneUsuarioLog();
    this.album = this.obtenerAlbumPlay();
    this.dataInicial(this.usuario.id, this.album.id);
  }

  addToPlaylist(event: Event, pista: Pista) {
    let icon: string = (<HTMLImageElement>event.target)?.getAttribute('src')!;
    if (icon.includes('blanco')) {
      (<HTMLImageElement>event.target)?.setAttribute(
        'src',
        icon.replace('blanco', 'color')
      );
      this.agregarPlaylistPista(pista, this.misPlaylist[0]);
    } else {
      (<HTMLImageElement>event.target)?.setAttribute(
        'src',
        icon.replace('color', 'blanco')
      );
    }
  }

  agregarPlaylistPista(pista: Pista, playlist: Playlist) {
    let playlistPista: PlaylistPista = new PlaylistPista();
    playlistPista.pistaId = pista.id;
    playlistPista.playlistId = playlist.id;
    playlistPista.fechaRegistro = new Date();
    this._playlistServices.agregarPistaPlaylist(playlistPista).then(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Cancion registrada',
          text: 'Se ha registrado en la playlist ' + playlist.nombre + '.',
        });
      },
      (error: any) => this.controlError(error)
    );
  }

  pauseSong(index: number) {}
  playSong(index: number) {
    /* this.playAlbum.emit(this.album);
    console.log(`Album from pista-displayed: ${this.album}`); */
  }

  //#region Datos basicos

  dataInicial(usuarioId: string, albumId: string) {
    forkJoin([
      this._playlistServices.listaPorUsuario(usuarioId),
      this._pistaService.listaPorAlbum(albumId),
    ]).subscribe(
      (result) => {
        debugger;
        this.misPlaylist = result[0] as Playlist[];
        this.pistas = result[1] as Pista[];
        this._pistaService
          .obtenerIdPistasEnPlaylist(this.misPlaylist[0].id)
          .subscribe((data: string) => console.log(data));
      },
      (error) => {
        this.controlError(error[0]), this.controlError(error[1]);
      }
    );
  }

  obtieneUsuarioLog(): any {
    let usuario = JSON.parse(localStorage.getItem('userResponse') as string);
    if (usuario.user == 'google') return usuario.data[1];
    else return usuario.data;
  }

  obtenerAlbumPlay(): Album {
    let album: Album = JSON.parse(
      localStorage.getItem('albumToPlay') as string
    ).data;
    return album;
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
