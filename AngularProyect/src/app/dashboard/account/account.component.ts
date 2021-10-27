import { Component, OnInit } from '@angular/core';
import { DataService } from '../../aplication-data/rest/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  usuario:any={};
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.usuario=JSON.parse(localStorage.getItem('userResponse') as string);
  }
  
  getUsuario(id:string){

  }
}
