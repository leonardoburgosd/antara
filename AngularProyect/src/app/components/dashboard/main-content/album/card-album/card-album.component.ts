import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

import { Album } from 'src/app/classes/Album';
import { AlbumService } from 'src/app/services/album.service';
@Component({
  selector: 'app-card-album',
  templateUrl: './card-album.component.html',
  styleUrls: ['./card-album.component.css'],
})
export class CardAlbumComponent implements OnInit {
  @ViewChild('opciones') opciones!: ElementRef;
  @Output() showOpciones: EventEmitter<ElementRef> = new EventEmitter();
  @Output() deleteAlbum: EventEmitter<string> = new EventEmitter();
  @Input() album: Album = new Album();
  constructor(private albumService: AlbumService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void { }
  ngAfterViewInit() { }

  mostrarOpciones() {
    this.showOpciones.emit(this.opciones);
  }

  eliminarAlbum() {
    this.deleteAlbum.emit(this.album.id);
  }

  publicarPlaylist(album: Album) {
    Swal.fire({
      title: '¿Seguro que desea publicar este album?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#017AFF',
      cancelButtonColor: '#1d242e',
      confirmButtonText: 'Si, eliminar'
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
              text: 'Se ah publicado el album correctamente.',
            });
          },
          (error: any) => {
            this.spinner.hide();
            this.controlError(error);
          }
        );
      }
    })
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
}
