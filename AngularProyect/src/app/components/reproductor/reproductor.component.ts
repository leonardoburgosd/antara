import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-reproductor',
  templateUrl: './reproductor.component.html',
  styleUrls: ['./reproductor.component.css']
})
export class ReproductorComponent implements OnInit {
  @Input() listaCanciones: any = [];
  constructor() { }

  ngOnInit(): void {
    
  }

}
