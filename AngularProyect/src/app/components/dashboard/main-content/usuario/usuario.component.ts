import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
})
export class UsuarioComponent implements OnInit {
  usuario: any = {};
  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('userResponse') as string);
  }

  getUsuario(id: string) {}
}
