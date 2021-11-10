import { Component, OnInit } from '@angular/core';
import { Album } from 'src/app/aplication-data/structure/Album';

@Component({
  selector: 'app-explora',
  templateUrl: './explora.component.html',
  styleUrls: ['./explora.component.css'],
})
export class ExploraComponent implements OnInit {
  sections: { title: string; albumes: string }[] = [
    {
      title: 'Hecho en Perú',
      albumes: '',
    },
    {
      title: 'Lo ultimo que eschaste',
      albumes: '',
    },
    {
      title: 'Energia positiva para tu hogar',
      albumes: '',
    },
    {
      title: 'Nuevos lanzamientos populares',
      albumes: '',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
