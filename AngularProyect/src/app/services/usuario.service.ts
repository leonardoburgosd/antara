import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from '../classes/Auth';
import { Usuario } from '../classes/Usuario';
import { Utilities } from '../shared/utilities';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  Authorization: 'Bearer ',
};
@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private API: string = new Utilities().apiUrl;
  constructor(private httpClient: HttpClient) {
    this.API = `${this.API}/api/usuario`;
  }

  login(user: Auth): any {
    return this.httpClient
      .post(this.API + '/login', user, httpOptions)
      .toPromise();
  }

  registro(user: Usuario): any {
    let data: FormData = new FormData();
    data.append('Id', user.id as string);
    data.append('Email', user.email as string);
    data.append('Password', user.password as string);
    data.append('Nombre', user.nombre as string);
    if (user.tipo == 'google') {
      let fecha: string =
        user.fechaNacimiento?.getDate() +
        '/' +
        user.fechaNacimiento?.getMonth() +
        '/' +
        user.fechaNacimiento?.getFullYear();
      data.append('FechaNacimiento', fecha);
    }
    if (user.tipo == 'antara')
      data.append(
        'FechaNacimiento',
        user.fechaNacimiento?.toString() as string
      );
    data.append('Genero', user.genero as string);
    data.append('Pais', user.pais as string);
    data.append('Tipo', user.tipo as string);
    data.append('file', '');
    return this.httpClient.post(this.API, data).toPromise();
  }

  obtenerUsuario(usuarioId: string): any {
    return this.httpClient.get(this.API + '/' + usuarioId).toPromise();
  }
}
