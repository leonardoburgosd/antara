import { Component, OnInit } from '@angular/core';
import { DataServiceAlbum } from 'src/app/aplication-data/rest/DataServiceAlbum';
import { Album } from 'src/app/aplication-data/structure/Album';
import { Pista } from 'src/app/aplication-data/structure/Pista';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-album-new',
  templateUrl: './album-new.component.html',
  styleUrls: ['./album-new.component.css']
})
export class AlbumNewComponent implements OnInit {
  usuario: any = {};
  album: Album = new Album();
  pistas: Pista[] = [];
  constructor(private dataService: DataServiceAlbum) { }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('userResponse') as string);
    this.album = this.inicializaNuevoAlbum();
  }


  inicializaNuevoAlbum(): Album {
    let newAlbum: Album = new Album();
    newAlbum.nombre = "Mi playlist";
    newAlbum.descripcion = "Descripcion de la playlist.";
    newAlbum.portadaUrl = "../../../../assets/images/musica.png";
    newAlbum.estaActivo = true;
    newAlbum.usuarioId = this.usuario.data.id;
    return newAlbum;
  }

  registrarPlaylistBorrador() {
    this.dataService.registro(this.album).then(
      (response: any) => { this.album = response; },
      (error: any) => { this.controlError(error); }
    );
  }

  controlError(err: any) {
    if (err.status == 500)
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'Por favor revise su conexión de internet.'
      });
  }
}
