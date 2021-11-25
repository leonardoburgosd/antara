import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

export class GeneroService {
    private API: string = new Utilities().apiUrl;
    constructor(private httpClient: HttpClient) {
        this.API = `${this.API}/api/genero`;
    }

    lista(): any {
        return this.httpClient.get(this.API).toPromise();
    }
}
