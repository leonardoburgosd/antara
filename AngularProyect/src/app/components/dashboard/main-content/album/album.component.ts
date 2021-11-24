import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

import { Album } from 'src/app/classes/Album';
import { AlbumService } from 'src/app/services/album.service';
import { CardAlbumComponent } from './card-album/card-album.component';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css'],
})
export class AlbumComponent implements OnInit {
  @ViewChildren('cards') cards: QueryList<CardAlbumComponent> = new QueryList();
  usuario: any = {};
  albums: Album[] = [];
  subscription!: Subscription;
  constructor(
    private albumService: AlbumService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.usuario = this.obtieneUsuarioLog();
    this.listaMisAlbums(this.usuario.id);
  }

  ngAfterViewInit() { }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  listaMisAlbums(usuarioId: number) {
    this.spinner.show();
    this.subscription = this.albumService
      .obtenerPorUsuario(usuarioId)
      .subscribe(
        (response: any) => {
          this.albums = response;
          this.spinner.hide();
        },
        (err: any) => {
          this.controlErrores(err);
        }
      );
  }

  deleteAlbum(albumId: string) {
    Swal.fire({
      title: '¿Seguro que desea eliminar este album?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#017AFF',
      cancelButtonColor: '#1d242e',
      confirmButtonText: 'Si, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.subscription = this.albumService.eliminar(albumId).subscribe(
          () => {
            this.listaMisAlbums(this.usuario.id);
            console.log('Eliminado correctamente');
            this.spinner.hide();
          },
          (err: any) => {
            this.controlErrores(err);
            this.spinner.hide();
          }
        );
      }
    });
  }

  //#region Complementos

  obtieneUsuarioLog(): any {
    let usuario = JSON.parse(localStorage.getItem('userResponse') as string);
    if (usuario.user == 'google') return usuario.data[1];
    else return usuario.data;
  }

  controlErrores(error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error al guardar los datos.',
      text: error,
    });
  }

  //#endregion

  //#region metodosDOMControl

  showOpciones(element: ElementRef) {
    this.cards.forEach((element: CardAlbumComponent) =>
      element.opciones.nativeElement.classList.remove('active')
    );
    element.nativeElement.classList.add('active');
  }

  /*
    Este metodo escucha clicks dentro del componente AlbumComponent
    Si la ventana de opciones de las cards esta abierta se debe cerrar
    al hacer click fuera de esta
    La forma de detectar donde se esta haciendo click es revisando los padres
    del target, si dentro de sus padres entre la posicion 3 y 6 de
    se encuentra un app-card-album, entonces se está haciendo click en los 3
    puntos (...) o en sus opciones por lo tanto no se cierra la ventana
  */
  @HostListener('click', ['$event'])
  onClick(e: PointerEvent) {
    let cerrar = true;
    /*
      recorre las posiciones 3-4-5 de los padres del e.target
    */
    for (let i = 3; i < 6; i++) {
      let elemento = e.composedPath()[i] as HTMLElement;

      if (elemento.localName == 'app-card-album') {
        let primerE = e.composedPath()[0] as HTMLElement;
        if (
          /*
            si se encuentra un padre app-card-album y el e.target
            es un div(contenedor de los 3 puntos (...)), un i(icono de los 3 puntos (...))
            o un li(opciones del menu) no se cierra la ventana
          */
          primerE.localName == 'div' ||
          primerE.localName == 'i' ||
          primerE.localName == 'li'
        ) {
          cerrar = false;
          break;
        }
      }
    }
    /*
    si el click se realizo fuera del icono de opciones o de las opciones
    se cierra la ventana
    */
    if (cerrar) {
      this.cards.forEach((element: CardAlbumComponent) =>
        element.opciones.nativeElement.classList.remove('active')
      );
    }
  }

  //#endregion
}
