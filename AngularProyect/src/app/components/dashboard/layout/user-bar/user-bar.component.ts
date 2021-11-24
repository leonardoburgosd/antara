import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-bar',
  templateUrl: './user-bar.component.html',
  styleUrls: ['./user-bar.component.css'],
})
export class UserBarComponent implements OnInit {
  @Input()
  usuario: any = {};
  constructor(private _router: Router) {}

  ngOnInit(): void {}
  logout() {
    this._router.navigate(['/login']);
  }
}
