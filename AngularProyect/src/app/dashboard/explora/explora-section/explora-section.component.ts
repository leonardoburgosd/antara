import { Component, Input, OnInit } from '@angular/core';
import { Album } from 'src/app/aplication-data/structure/Album';

@Component({
  selector: 'app-explora-section',
  templateUrl: './explora-section.component.html',
  styleUrls: ['./explora-section.component.css'],
})
export class ExploraSectionComponent implements OnInit {
  @Input()
  section: { title: string; albumes: string } = { title: '', albumes: '' };

  constructor() {}

  ngOnInit(): void {}
}
