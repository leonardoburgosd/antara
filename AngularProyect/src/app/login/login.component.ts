import { Component, OnInit } from '@angular/core';
import { DataService } from '../aplication-data/rest/usuario';
import { Auth } from '../aplication-data/structure/Auth';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  auth: Auth = new Auth();
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
  }

  login() {
    this.dataService.login(this.auth).then((res: any) => {
      console.log(res);
    }, (err: any) => {
      console.log(err);
    }
    );
  }

  register(){
    
  }
}
