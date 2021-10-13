import { Component, OnInit } from '@angular/core';
import { DataService } from '../aplication-data/rest/usuario';
import { Auth } from '../aplication-data/structure/Auth';
import Swal from 'sweetalert2';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';

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

  constructor(private dataService: DataService,private socialAuthService: SocialAuthService) { }

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = (user != null);
      console.log(this.socialUser);
    });
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
    else if (err.status == 404)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.error.title
      })
  }


  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
}
