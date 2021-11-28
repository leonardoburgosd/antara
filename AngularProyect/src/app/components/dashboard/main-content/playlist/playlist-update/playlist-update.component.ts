import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import { Pista } from 'src/app/classes/Pista';
import { Playlist } from 'src/app/classes/Playlist';
import { PistasService } from 'src/app/services/pistas.service';
import { PlaylistService } from 'src/app/services/playlist.service';
import { ReproductorInteractionService } from 'src/app/services/reproductor-interaction.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-playlist-update',
  templateUrl: './playlist-update.component.html',
  styleUrls: ['./playlist-update.component.css'],
})
export class PlaylistUpdateComponent implements OnInit {
  @ViewChildren('pistaRow') pistasRow: QueryList<ElementRef> = new QueryList();
  imagenUrl: string | ArrayBuffer | null | undefined;
  playlist: Playlist = new Playlist();
  pistas: Pista[] = [];
  usuario: any = {};
  portada!: File;

  constructor(
    private playlistService: PlaylistService,
    private pistasService: PistasService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private reproductorInteractionService: ReproductorInteractionService,
    private _router: Router
  ) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let parametro = params.get('playlistId');
      this.playlist.id =
        parametro != null && parametro != undefined ? parametro : '';
    });
  }
  ngOnInit(): void {
    this.spinner.show();
    this.usuario = this.obtieneUsuarioLog();
    this.detallePlaylist(this.playlist.id);
    this.spinner.hide();
    this.reproductorInteractionService.tableIndex$.subscribe(
      (data: number) => this.paintRow(data),
      (err) => {}
    );
  }

  actualizarPlaylist() {
    this.playlistService.actualizar(this.playlist, this.portada).subscribe(
      (response: any) => console.log(response),
      (error: any) => this.controlError(error)
    );
  }

  paintRow(index: number) {
    console.log('holiwis');

    this.pistasRow.forEach((item: ElementRef) => {
      item.nativeElement.classList.remove('playing');
      item.nativeElement.classList.remove('paused');
    });
    this.pistasRow.toArray()[index].nativeElement.classList.add('playing');
  }

  playSong(index: number) {
    this.reproductorInteractionService.playAlbum({
      pistas: this.pistas,
      //portadaAlbum: this.album.portadaUrl,
      album: this.playlist,
      songIndex: index,
    });
  }

  pauseSong(index: number) {
    this.pistasRow.forEach((item: ElementRef) => {
      item.nativeElement.classList.remove('playing');
      item.nativeElement.classList.remove('paused');
    });
    this.pistasRow.toArray()[index].nativeElement.classList.add('paused');
    this.reproductorInteractionService.pauseSong();
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
      this.pistasService.listaPorPlaylist(playlisId),
    ]).subscribe((result) => {
      this.playlist = result[0] as Playlist;
      this.pistas = result[1] as Pista[];
    });
  }

  seleccionaImagen(event: any) {
    this.portada = <File>event.target.files[0];
  }

  mostrarImagen() {
    console.log('holiwis');
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
