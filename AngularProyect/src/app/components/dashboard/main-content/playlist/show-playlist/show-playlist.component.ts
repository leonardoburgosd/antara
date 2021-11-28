import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

import { Album } from 'src/app/classes/Album';
import { Pista } from 'src/app/classes/Pista';
import { Playlist, PlaylistPista } from 'src/app/classes/Playlist';
import { PistasService } from 'src/app/services/pistas.service';
import { PlaylistService } from 'src/app/services/playlist.service';
import { ReproductorInteractionService } from 'src/app/services/reproductor-interaction.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-playlist',
  templateUrl: './show-playlist.component.html',
  styleUrls: ['./show-playlist.component.css'],
})
export class ShowPlaylistComponent implements OnInit {
  @ViewChildren('pistaRow') pistasRow: QueryList<ElementRef> = new QueryList();
  album: Album = new Album();
  usuario: any = {};
  pistas: Pista[] = [];
  misPlaylist: Playlist[] = [];

  constructor(
    private _pistaService: PistasService,
    private _playlistServices: PlaylistService,
    private _reproductorInteractionService: ReproductorInteractionService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.obtieneUsuarioLog();
    this.album = this.obtenerAlbumPlay();
    this.dataInicial(this.usuario.id, this.album.id);
    this._reproductorInteractionService.tableIndex$.subscribe(
      (data: number) => this.paintRow(data),
      (err) => {}
    );
  }
  isInFavorites(pista: Pista): Boolean {
    let isInFavorites = null;
    let pistasIdList: [] = JSON.parse(
      localStorage.getItem('pistasIdList') as string
    );
    isInFavorites = pistasIdList.find((item: any) => {
      if (item.pistaId == pista.id) {
        return true;
      }
      return false;
    });
    if (isInFavorites == null) return false;
    return true;
  }

  addToPlaylist(event: Event, pista: Pista) {
    if (this.isInFavorites(pista)) {
      this.eliminarPlaylistPista(pista, this.misPlaylist[0]);
    } else {
      this.agregarPlaylistPista(pista, this.misPlaylist[0]);
    }

    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';
    this._router.navigate(['dashboard/play', this.usuario.id]);
  }

  eliminarPlaylistPista(pista: Pista, playlist: Playlist) {
    let playlistPista: PlaylistPista = new PlaylistPista();
    playlistPista.pistaId = pista.id;
    playlistPista.playlistId = playlist.id;
    playlistPista.fechaRegistro = new Date();
    this._playlistServices.eliminarPlaylistPista(playlistPista).then(
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

  paintRow(index: number) {
    this.pistasRow.forEach((item: ElementRef) => {
      item.nativeElement.classList.remove('playing');
      item.nativeElement.classList.remove('paused');
    });
    this.pistasRow.toArray()[index].nativeElement.classList.add('playing');
  }

  playSong(index: number) {
    this._reproductorInteractionService.playAlbum({
      pistas: this.pistas,
      //portadaAlbum: this.album.portadaUrl,
      album: this.album,
      songIndex: index,
    });
  }

  pauseSong(index: number) {
    this.pistasRow.forEach((item: ElementRef) => {
      item.nativeElement.classList.remove('playing');
      item.nativeElement.classList.remove('paused');
    });
    this.pistasRow.toArray()[index].nativeElement.classList.add('paused');
    this._reproductorInteractionService.pauseSong();
  }

  //#region Datos basicos

  dataInicial(usuarioId: string, albumId: string) {
    forkJoin([
      this._playlistServices.listaPorUsuario(usuarioId),
      this._pistaService.listaPorAlbum(albumId),
    ]).subscribe(
      (result) => {
        this.misPlaylist = result[0] as Playlist[];
        this.pistas = result[1] as Pista[];
        this._pistaService
          .obtenerIdPistasEnPlaylist(this.misPlaylist[0].id)
          .subscribe((data: any) => {
            localStorage.setItem('pistasIdList', JSON.stringify(data));
          });
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

  formatTime(sec: number): string {
    let min = Math.floor(sec / 60);
    sec = sec % 60;

    if (min >= 60) {
      let hour = Math.floor(min / 60);
      min = min % 60;
      return (
        this.formatNumber(hour) +
        ':' +
        this.formatNumber(min) +
        ':' +
        this.formatNumber(Number.parseInt(sec.toFixed(0)))
      );
    }
    return (
      this.formatNumber(min) +
      ':' +
      this.formatNumber(Number.parseInt(sec.toFixed(0)))
    );
  }

  formatNumber(number: number): string {
    let cadena: string = number.toString();
    if (number < 10) {
      cadena = '0' + number;
    }
    return cadena;
  }
}
