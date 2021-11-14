import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  usuario: any = {};
  constructor() {}

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('userResponse') as string);
  }

  playAlbum(event: Event) {
    console.log(event.target);
    console.log('hi from dashboard');
  }
}