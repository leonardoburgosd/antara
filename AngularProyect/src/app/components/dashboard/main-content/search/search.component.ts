import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Pista } from 'src/app/classes/Pista';

import { PistasService } from 'src/app/services/pistas.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  cadenaBusqueda: string = '';
  pistas:Pista[]=[];
  constructor(private route: ActivatedRoute, private pistasService: PistasService) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let parametro = params.get('stringSearch');
      this.cadenaBusqueda =
        parametro != null && parametro != undefined ? parametro : '';
      this.buscar(this.cadenaBusqueda);
    });
  }

  ngOnInit(): void {

  }

  buscar(cadenaBusqueda: string) {
    this.pistasService.buscar(cadenaBusqueda).then(
      (response: any) => this.pistas = response,
      (error: any) => console.log(error)
    );
  }
}
