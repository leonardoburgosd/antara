import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/classes/Usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
})
export class UsuarioComponent implements OnInit {
  usuario: any = {};
  usuarioUpdate : Usuario = new Usuario();
  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('userResponse') as string);
    this.getUsuario(this.usuario.data.id);
  }

  getUsuario(id: string) {
    this.usuarioService.obtenerUsuario(id).then((response:any)=> {this.usuarioUpdate = response; console.log(this.usuarioUpdate);}, (error:any)=> console.log(error))
  }
}
