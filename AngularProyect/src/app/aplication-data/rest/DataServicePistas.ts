import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Pista } from "../structure/Pista";

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    }),
    Authorization: "Bearer "
};

@Injectable({
    providedIn: 'root'
})

export class DataServicePistas{
    private API: string;
    constructor(private httpClient: HttpClient) {
        //this.API = 'https://localhost:44392/api/album';
        this.API ='https://apislatch.azurewebsites.net/api/album';
    }

    registro(pista: Pista, audio:File): any {
        let data:FormData = new FormData();
        data.append('Nombre', pista.nombre);
        data.append('FechaRegistro', pista.fechaRegistro.toString());
        data.append('AnoCreacion', pista.anoCreacion.toString());
        data.append('Interprete', pista.interprete);
        data.append('Compositor', pista.compositor);
        data.append('Productor', pista.productor);
        data.append('Reproducciones', pista.reproducciones.toString());
        data.append('GeneroId', pista.generoId.toString());
        data.append('AlbumId', pista.albumId.toString());
        data.append('EstaActivo', 'true');
        data.append('File', audio);
        return this.httpClient.post(this.API, data).toPromise();
    }

}
