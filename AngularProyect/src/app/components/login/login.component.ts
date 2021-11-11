import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import { Usuario } from 'src/app/classes/Usuario';
import { Auth } from 'src/app/classes/Auth';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  auth: Auth = new Auth();
  error: any = [];
  socialUser: SocialUser | undefined;
  isLoggedin: boolean | undefined;

  constructor(
    private usuarioService: UsuarioService,
    private socialAuthService: SocialAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = user != null;
      localStorage.setItem(
        'userResponse',
        JSON.stringify({ user: 'google', data: [this.socialUser] })
      );
      this.usuarioService
        .registro(this.BypassUserGoogleToUserAntara(this.socialUser))
        .then(
          (res: any) => {
            localStorage.setItem(
              'userResponse',
              JSON.stringify({ user: 'google', data: [this.socialUser, res] })
            );
          },
          (err: any) => {
            this.controlError(err);
          }
        );
      this.router.navigate(['/dashboard']);
    });
  }

  login() {
    this.usuarioService.login(this.auth).then(
      (res: any) => {
        localStorage.setItem(
          'userResponse',
          JSON.stringify({ user: 'antara', data: res })
        );
        this.router.navigate(['/dashboard']);
      },
      (err: any) => {
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
        text: 'Usuario o password incorrectos.',
      });
    else if (err.status == 500)
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'Por favor revise su conexión de internet.',
      });
  }

  //#region Usuario de google
  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  BypassUserGoogleToUserAntara(userGoogle: SocialUser): Usuario {
    let userAntara: Usuario = new Usuario();
    userAntara.id = userAntara.convertToUUID(userGoogle.id);
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
