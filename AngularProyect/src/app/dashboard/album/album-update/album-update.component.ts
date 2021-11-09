import { Component, OnInit } from '@angular/core';
import { Album } from 'src/app/aplication-data/structure/Album';
import { Pista } from 'src/app/aplication-data/structure/Pista';
import { DataServicePistas } from 'src/app/aplication-data/rest/DataServicePistas';
import { DataServiceAlbum } from 'src/app/aplication-data/rest/DataServiceAlbum';

import { ActivatedRoute, ParamMap } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-album-update',
  templateUrl: './album-update.component.html',
  styleUrls: ['./album-update.component.css']
})
export class AlbumUpdateComponent implements OnInit {
  usuario: any = {};
  albumId: string = '';
  imagenUrl: string | ArrayBuffer | null | undefined;
  album: Album = new Album();
  pistas: Pista[] = [];
  constructor(private dataServicePista: DataServicePistas, private dataServiceAlbum: DataServiceAlbum, private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let parametro = params.get('albumId');
      this.albumId = parametro != null && parametro != undefined ? parametro : "";
    });
  }

  ngOnInit(): void {
    this.usuario = this.obtieneUsuarioLog();
    this.detalleAlbum(this.albumId);
  }

  //#region Complementos

  detalleAlbum(albumId: string) {
    forkJoin(
      [this.dataServiceAlbum.detalle(albumId),
      this.dataServicePista.listaPorAlbum(albumId)]
    ).subscribe(
      result => {
        this.album = result[0] as Album;
        this.pistas = result[1] as Pista[];
      }
    );
  }

  obtieneUsuarioLog(): any {
    let usuario = JSON.parse(localStorage.getItem('userResponse') as string);
    if (usuario.user == 'google') return usuario.data[1];
    else return usuario.data;
  }

  //#endregion
}
