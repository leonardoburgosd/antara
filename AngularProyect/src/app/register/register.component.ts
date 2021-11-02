import { Component, OnInit } from '@angular/core';
import {  DataServiceUsuario } from '../aplication-data/rest/DataServiceUsuario';
import { Usuario } from '../aplication-data/structure/Usuario';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  usuario: Usuario = new Usuario();
  error: any = [];
  emailVerification: string = '';
  constructor(private dataService: DataServiceUsuario,private router:Router) { }

  ngOnInit(): void {
    this.usuario.pais = "Perú";
    this.usuario.genero = 'N';
    this.usuario.tipo = 'antara';
  }

  registro() {
    if (this.validacionForm()) {
      this.dataService.registro(this.usuario).then((res: any) => {
        console.log(res);
        this.router.navigate(['/login']);
      }, (err: any) => {
        this.controlError(err);
      });
    }
  }


  controlError(err: any) {
    if (err.status == 400) this.error = err.error.errors;
    else if (err.status == 401)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.error.value.error
      })
  }

  validacionForm(): Boolean {
    let validacion: Boolean[] = [false, false];

    //Valida cumpleaños
    if (this.usuario.fechaNacimiento == undefined) {
      this.error.fechaNacimiento = ['Debe ingresar su fecha de nacimiento.']
      validacion[0] = false;
    }
    else {
      this.error.fechaNacimiento = [];
      validacion[0] = true;
    }

    //Valida email
    if (this.emailVerification == '') {
      this.error.EmailVerification = ['Debe ingresar el email'];
      validacion[1] = false;
    }
    else if (this.emailVerification != this.usuario.email) {
      this.error.EmailVerification = ['El email no coincide.'];
      validacion[1] = false;
    }
    else {
      this.error.EmailVerification = [];
      validacion[1] = true;
    }

    return validacion.every(element =>  element==true );
  }
}
