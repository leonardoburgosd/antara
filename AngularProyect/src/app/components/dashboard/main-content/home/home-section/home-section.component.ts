import { Component, Input, OnInit } from '@angular/core';
import { Album } from 'src/app/classes/Album';

@Component({
  selector: 'app-home-section',
  templateUrl: './home-section.component.html',
  styleUrls: ['./home-section.component.css'],
})
export class HomeSectionComponent implements OnInit {
  @Input()
  section: { title: string; albumes: Album[] } = { title: '', albumes: [] };

  constructor() {}

  ngOnInit(): void {}
}
