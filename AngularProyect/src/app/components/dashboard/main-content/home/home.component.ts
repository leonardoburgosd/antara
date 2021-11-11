import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
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
