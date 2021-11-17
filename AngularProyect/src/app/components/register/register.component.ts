import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/classes/Usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { PaisesService } from 'src/app/services/paises.service';
import { faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  usuario: Usuario = new Usuario();
  error: any = [];
  emailVerification: string = '';
  paises: Observable<any> = new Observable();
  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private _paisesService: PaisesService
  ) {}

  ngOnInit(): void {
    this._paisesService.getToken().subscribe(
      (data: any) => {
        if (data.auth_token) {
          let token = data.auth_token;
          this.paises = this._paisesService.getPaises(token);
          //.subscribe((data: any) => console.log(data));
        }
      },
      (err) => console.log(err)
    );
    this.usuario.pais = 'PE';
    this.usuario.genero = 'N';
    this.usuario.tipo = 'antara';
  }

  registro() {
    if (this.validacionForm()) {
      this.usuarioService.registro(this.usuario).then(
        (res: any) => {
          console.log(res);
          this.router.navigate(['/login']);
        },
        (err: any) => {
          this.controlError(err);
        }
      );
    }
  }

  controlError(err: any) {
    if (err.status == 400) this.error = err.error.errors;
    else if (err.status == 401)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.error.value.error,
      });
  }

  validacionForm(): Boolean {
    let validacion: Boolean[] = [false, false];

    //Valida cumpleaños
    if (this.usuario.fechaNacimiento == undefined) {
      this.error.fechaNacimiento = ['Debe ingresar su fecha de nacimiento.'];
      validacion[0] = false;
    } else {
      this.error.fechaNacimiento = [];
      validacion[0] = true;
    }

    //Valida email
    if (this.emailVerification == '') {
      this.error.EmailVerification = ['Debe ingresar el email'];
      validacion[1] = false;
    } else if (this.emailVerification != this.usuario.email) {
      this.error.EmailVerification = ['El email no coincide.'];
      validacion[1] = false;
    } else {
      this.error.EmailVerification = [];
      validacion[1] = true;
    }

    return validacion.every((element) => element == true);
  }
}
