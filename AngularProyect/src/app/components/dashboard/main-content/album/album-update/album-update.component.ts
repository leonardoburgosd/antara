import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Album } from 'src/app/classes/Album';
import { Pista } from 'src/app/classes/Pista';
import { PistasService } from 'src/app/services/pistas.service';
import { AlbumService } from 'src/app/services/album.service';
import { ReproductorInteractionService } from 'src/app/services/reproductor-interaction.service';

@Component({
  selector: 'app-album-update',
  templateUrl: './album-update.component.html',
  styleUrls: ['./album-update.component.css'],
})
export class AlbumUpdateComponent implements OnInit {
  @ViewChildren('pistaRow') pistasRow: QueryList<ElementRef> = new QueryList();
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
    private spinner: NgxSpinnerService,
    private reproductorInteractionService: ReproductorInteractionService,
    private _router: Router
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
    this.reproductorInteractionService.tableIndex$.subscribe(
      (data: number) => this.paintRow(data),
      (err) => {}
    );
  }

  ngOnViewInit() {}

  paintRow(index: number) {
    this.pistasRow.forEach((item: ElementRef) => {
      item.nativeElement.classList.remove('playing');
      item.nativeElement.classList.remove('paused');
    });
    this.pistasRow.toArray()[index].nativeElement.classList.add('playing');
  }

  playSong(index: number) {
    this.reproductorInteractionService.playAlbum({
      pistas: this.pistas,
      portadaAlbum: this.album.portadaUrl,
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
  guardarAudio() {
    this.spinner.show();
    this.pista.albumId = this.album.id;
    this.pistaService.registro(this.pista, this.audio).subscribe(
      (response: any) => {
        this.listarPistasPorAlbum();
        this.spinner.hide();
      },
      (error: any) => {
        this.controlError(error);
        this.spinner.hide();
      }
    );
  }

  actualizarAlbumBorrador() {
    this.spinner.show();
    this.albumService.actualizar(this.album).subscribe(
      (response: any) => {
        this.spinner.hide();
        Swal.fire({
          icon: 'success',
          title: 'Album actualizado',
          text: 'Se ah actualizo el album correctamente.',
        });
      },
      (error: any) => {
        this.spinner.hide();
        this.controlError(error);
      }
    );
  }

  publicarAlbum(album: Album) {
    Swal.fire({
      title: '¿Seguro que desea publicar este album?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#017AFF',
      cancelButtonColor: '#1d242e',
      confirmButtonText: 'Si, publicar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.albumService.publicar(album.id).subscribe(
          (response: any) => {
            this.album.estaPublicado = true;
            this.spinner.hide();
            Swal.fire({
              icon: 'success',
              title: 'Album publicado.',
              text: 'Se ha publicado el album correctamente.',
            });
            this.detalleAlbum(this.albumId);
          },
          (error: any) => {
            this.spinner.hide();
            this.controlError(error);
          }
        );
      }
    });
  }

  eliminarPista(pista: Pista) {
    Swal.fire({
      title: '¿Seguro que desea eliminar esta pista?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#017AFF',
      cancelButtonColor: '#1d242e',
      confirmButtonText: 'Si, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.pistaService.eliminar(pista.id).then(
          (response: any) => {
            this.listarPistasPorAlbum();
            this.spinner.hide();
            Swal.fire({
              icon: 'success',
              title: 'Pista eliminada.',
              text: 'Se ha eliminado la pista correctamente.',
            });
          },
          (error: any) => {
            this.spinner.hide();
            this.controlError(error);
          }
        );
      }
    });
  }
  //#region Complementos

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

  listarPistasPorAlbum() {
    this.pistaService.listaPorAlbum(this.albumId).then(
      (response: Pista[]) => {
        this.pistas = response;
      },
      (error: any) => this.controlError(error)
    );
  }
  //#endregion
}
