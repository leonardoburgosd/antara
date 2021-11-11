import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Album } from 'src/app/classes/Album';

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
  constructor() {}

  ngOnInit(): void {}
  ngAfterViewInit() {}
  mostrarOpciones() {
    this.showOpciones.emit(this.opciones);
  }
  eliminarAlbum() {
    this.deleteAlbum.emit(this.album.id);
  }
}
