import { Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Playlist } from 'src/app/classes/Playlist';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-card-pista',
  templateUrl: './card-pista.component.html',
  styleUrls: ['./card-pista.component.css']
})

export class CardPistaComponent implements OnInit {
  @ViewChild('opciones') opciones!: ElementRef;
  @Output() showOpciones: EventEmitter<ElementRef> = new EventEmitter();
  @Output() deletePlaylist: EventEmitter<string> = new EventEmitter();
  @Input() playlist:Playlist = new Playlist();
  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() { }

  mostrarOpciones() {
    this.showOpciones.emit(this.opciones);
  }

  eliminarPlaylist() {
    this.deletePlaylist.emit(this.playlist.id);
  }
}
