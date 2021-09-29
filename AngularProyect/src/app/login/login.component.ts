import { Component, OnInit } from '@angular/core';
import { DataService } from '../aplication-data/rest/usuario';
import { Auth } from '../aplication-data/structure/Auth';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  auth: Auth = new Auth();
  error: any = [];
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
  }

  login() {
    this.dataService.login(this.auth).then((res: any) => {
      console.log(res);
    }, (err: any) => {
      this.controlError(err);
    }
    );
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
}
