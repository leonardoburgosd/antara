import { Component, OnInit } from '@angular/core';
import { Album } from 'src/app/classes/Album';
import { AlbumService } from 'src/app/services/album.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  sections: { title: string; albumes: Album[] }[] = [
    {
      title: 'Hecho en Perú',
      albumes: [],
    },
    {
      title: 'Lo ultimo que eschaste',
      albumes: [],
    },
    {
      title: 'Energia positiva para tu hogar',
      albumes: [],
    },
    {
      title: 'Nuevos lanzamientos populares',
      albumes: [],
    },
  ];

  constructor(private _albumService: AlbumService) {}

  ngOnInit(): void {
    this._albumService.obtenerHechoEnPeru().subscribe((data: Album[]) => {
      this.sections[0].albumes = data;
    });
  }
}
