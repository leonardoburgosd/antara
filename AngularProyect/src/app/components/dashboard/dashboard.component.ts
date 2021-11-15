import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  usuario: any = {};
  cadenaString: string = '';
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('userResponse') as string);
  }

  playAlbum(event: Event) {
    console.log(event.target);
    console.log('hi from dashboard');
  }

  buscar(cadena:string) {
    this.router.navigate(['/dashboard/search/' + cadena]);
  }
}
