import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-reproductor',
  templateUrl: './reproductor.component.html',
  styleUrls: ['./reproductor.component.css']
})
export class ReproductorComponent implements OnInit {
  @Input() nombre:string | undefined;
  constructor() { }

  ngOnInit(): void {
  }

}
