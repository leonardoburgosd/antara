import { Component, OnInit } from '@angular/core';
import { DataServiceUsuario } from '../aplication-data/rest/DataServiceUsuario';
import { Auth } from '../aplication-data/structure/Auth';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { Usuario } from '../aplication-data/structure/Usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  auth: Auth = new Auth();
  error: any = [];
  socialUser: SocialUser | undefined;
  isLoggedin: boolean | undefined;

  constructor(private dataService: DataServiceUsuario, private socialAuthService: SocialAuthService, private router: Router) { }

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = (user != null);
      localStorage.setItem('userResponse', JSON.stringify({ user: 'google', data: this.socialUser }));
      this.dataService.registro(this.BypassUserGoogleToUserAntara(this.socialUser)).then((res: any) => {
        console.log(res);
      }, (err: any) => {
        this.controlError(err);
      });
      this.router.navigate(['/dashboard']);
    });
  }


  login() {
    this.dataService.login(this.auth).then((res: any) => {
      localStorage.setItem('userResponse', JSON.stringify({ user: 'antara', data: res }));
      this.router.navigate(['/dashboard']);
    }, (err: any) => {
      this.controlError(err);
    }
    );
  }

  controlError(err: any) {
    if (err.status == 400) this.error = err.error.errors;
    else if (err.status == 404)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Usuario o password incorrectos.'
      });
    else if (err.status == 500)
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'Por favor revise su conexión de internet.'
      });
  }

  //#region Usuario de google 
  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  BypassUserGoogleToUserAntara(userGoogle: SocialUser): Usuario {
    let userAntara: Usuario = new Usuario();
    userAntara.email = userGoogle.email;
    userAntara.fechaNacimiento = new Date(1900, 1, 1);
    userAntara.genero = 'N';
    userAntara.nombre = userGoogle.firstName + userGoogle.lastName;
    userAntara.pais = 'Perú';
    userAntara.password = '000000';
    userAntara.tipo = 'google';
    return userAntara;
  }
  //#endregion
}
