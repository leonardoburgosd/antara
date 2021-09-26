import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Auth } from '../structure/Auth';

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
    this.API = 'http://localhost/LoginSSO/Back/api/login';
  }

  login(user: Auth): any {
    return this.httpClient.post(this.API, user).toPromise();
  }

}