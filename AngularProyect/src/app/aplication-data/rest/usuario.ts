import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Auth } from '../structure/Auth';
import { Usuario } from '../structure/Usuario';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  Authorization: "Bearer "
};
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private API: string;
  constructor(
    private httpClient: HttpClient) {
    this.API = 'https://localhost:44392/api/usuario';
  }

  login(user: Auth): any {
    return this.httpClient.post(this.API+"/login", user,httpOptions).toPromise();
  }

  registro(user:Usuario):any{
    return this.httpClient.post(this.API,user,httpOptions).toPromise();
  }
}