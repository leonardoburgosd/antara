import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaisesService {
  httpOptions = {
    headers: new HttpHeaders({
      Accept: 'application/json',
      'api-token':
        's9urXY7clgAX14T7B572dvimZTBqqa8UNxikZfXBU6UggM6dnJANLVZfdIllh4at1XI',
      'user-email': 'vogaye3670@elastit.com',
    }),
  };
  private APIPaisesToken =
    'https://www.universal-tutorial.com/api/getaccesstoken';

  private APIPaises = 'https://www.universal-tutorial.com/api/countries/';
  constructor(private _http: HttpClient) {}

  getToken(): Observable<any> {
    return this._http.get<any>(this.APIPaisesToken, this.httpOptions);
  }

  getPaises(token: string): Observable<any> {
    this.httpOptions.headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
    });
    return this._http.get<any>(this.APIPaises, this.httpOptions);
  }
}
