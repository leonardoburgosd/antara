import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/classes/Usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
  providers: [DatePipe]
})
export class UsuarioComponent implements OnInit {
  usuario: any = {};
  usuarioUpdate: Usuario = new Usuario();
  constructor(private usuarioService: UsuarioService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('userResponse') as string);
    this.getUsuario(this.usuario.data.id);
  }

  getUsuario(id: string) {
    this.usuarioService.obtenerUsuario(id).then(
      (response: any) => {
        this.usuarioUpdate = response;
      },
      (error: any) => console.log(error))
  }

  actualizar(){
  }
}
