import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pista-displayed',
  templateUrl: './pista-displayed.component.html',
  styleUrls: ['./pista-displayed.component.css'],
})
export class PistaDisplayedComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  addToPlaylist(event: Event) {
    let icon: string = (<HTMLImageElement>event.target)?.getAttribute('src')!;
    if (icon.includes('blanco')) {
      (<HTMLImageElement>event.target)?.setAttribute(
        'src',
        icon.replace('blanco', 'color')
      );
    } else {
      (<HTMLImageElement>event.target)?.setAttribute(
        'src',
        icon.replace('color', 'blanco')
      );
    }
  }

  playSong() {
    console.log('playing');
  }
}
