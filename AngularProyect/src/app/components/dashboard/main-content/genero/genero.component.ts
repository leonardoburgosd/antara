import { Component, OnInit } from '@angular/core';
import { Genero } from 'src/app/classes/Genero';
import { GeneroService } from 'src/app/services/genero.service';

@Component({
  selector: 'app-genero',
  templateUrl: './genero.component.html',
  styleUrls: ['./genero.component.css']
})
export class GeneroComponent implements OnInit {
  generos: Genero[] = [];
  color: String[] = [
    '#0d6efd',
    '#ff5608',
    '#926599',
    '#b55d27',
    '#af0e4e',
    '#7f3659',
    '#892f90',
    '#17859e',
    '#12404f',
    '#ecc759',
    '#126751',
    '#ec6060',
    '#a58890'
  ];
  constructor(private generoService: GeneroService) { }

  ngOnInit(): void {
    this.listaGeneros();
  }

  listaGeneros() {
    this.generoService.lista().then(
      (response: any) => this.generos = response,
      (error: any) => console.log(error)
    );
  }

  generateRandom(): String {
    let randomColor: number = Math.floor(Math.random() * (12));
    return this.color[randomColor];
  }

}
