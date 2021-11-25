import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Pista } from 'src/app/classes/Pista';
import { PistasService } from 'src/app/services/pistas.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  pistas: Pista[] = [];
  generoId: number = 0;
  constructor(private pistasService: PistasService, private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let parametro = params.get('generoId');
      this.generoId = parametro != null && parametro != undefined ? Number(parametro) : 0;
    });
  }

  ngOnInit(): void {
    this.listarPistaPorGenero(this.generoId);
  }

  listarPistaPorGenero(generoId: number) {
    this.pistasService.listaPorGenero(generoId).then(
      (response: any) => this.pistas = response,
      (error: any) => console.log(error)
    );
  }
}
