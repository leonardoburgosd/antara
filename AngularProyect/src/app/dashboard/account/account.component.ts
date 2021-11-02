import { Component, OnInit } from '@angular/core';
import {  DataServiceUsuario } from '../../aplication-data/rest/DataServiceUsuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  usuario:any={};
  constructor(private dataService: DataServiceUsuario) { }

  ngOnInit(): void {
    this.usuario=JSON.parse(localStorage.getItem('userResponse') as string);
  }
  
  getUsuario(id:string){

  }
}
