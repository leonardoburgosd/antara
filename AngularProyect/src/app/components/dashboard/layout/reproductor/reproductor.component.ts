import { ThrowStmt } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Pista } from 'src/app/classes/Pista';
import { PistasService } from 'src/app/services/pistas.service';
import { ReproductorInteractionService } from 'src/app/services/reproductor-interaction.service';

@Component({
  selector: 'app-reproductor',
  templateUrl: './reproductor.component.html',
  styleUrls: ['./reproductor.component.css'],
})
export class ReproductorComponent implements OnInit {
  @Input()
  listaCanciones: any = [];

  playButton: HTMLElement | null = null;
  pauseButton: HTMLElement | null = null;
  nextButton: HTMLElement | null = null;
  prevButton: HTMLElement | null = null;
  pistaFile: HTMLAudioElement | null = null;
  musicContainer: HTMLElement | null = null;
  durationTime: HTMLElement | null = null;
  progressTime: HTMLElement | null = null;
  progressBar: HTMLElement | null = null;
  portada: HTMLElement | null = null;
  title: HTMLElement | null = null;
  interpreter: HTMLElement | null = null;
  songIndex: number = -1;
  songsList: Pista[] = [];
  portadaAlbum: string = '';

  constructor(private reproductorInteraction: ReproductorInteractionService) {}

  ngOnInit(): void {
    this.loadElements();

    this.reproductorInteraction.pistas$.subscribe(
      (data: any) => {
        this.songsList = data.pistas;
        this.portadaAlbum = data.portadaAlbum;
        if (this.songIndex !== data.songIndex) {
          this.songIndex = data.songIndex;
          this.loadSong(this.songsList[this.songIndex]);
        }
        this.playSong();
      },
      (err) => {},
      () => {}
    );

    this.reproductorInteraction.pause$.subscribe(
      () => {
        this.pauseSong();
        console.log('pause song');
      },
      (err) => {}
    );
  }

  paintRow() {
    this.reproductorInteraction.paintRow(this.songIndex);
  }

  loadElements() {
    this.playButton = document.getElementById('play');
    this.pauseButton = document.getElementById('pause');
    this.nextButton = document.getElementById('next');
    this.prevButton = document.getElementById('prev');
    this.pistaFile = <HTMLAudioElement>document.getElementById('pista');
    this.musicContainer = document.querySelector('.pista-info');
    this.durationTime = document.getElementById('duration-time');
    this.progressTime = document.getElementById('progress-time');
    this.progressBar = document.getElementById('progress-bar');
    this.portada = document.getElementById('portada');
    this.title = document.getElementById('title');
    this.interpreter = document.getElementById('interpreter');
  }

  loadSong(song: Pista) {
    if (this.portadaAlbum != null) {
      this.portada?.setAttribute('src', this.portadaAlbum);
    }
    this.pistaFile?.setAttribute('src', song.url);
    if (this.title) this.title.innerText = song.nombre;
    if (this.interpreter) this.interpreter.innerText = song.interprete;
    this.pistaFile!.onloadedmetadata = () => {
      if (this.durationTime)
        this.durationTime.innerText = this.formatTime(this.pistaFile!.duration);
      if (this.progressTime)
        this.progressTime.innerText = this.formatTime(
          this.pistaFile!.currentTime
        );
    };
  }

  loadTimes() {
    if (this.durationTime)
      this.durationTime.innerText = this.formatTime(this.pistaFile!.duration);
    if (this.progressTime)
      this.progressTime.innerText = this.formatTime(
        this.pistaFile!.currentTime
      );
    console.log(this.durationTime);
  }

  playSong() {
    if (this.pistaFile?.getAttribute('src') === '') {
      return;
    }
    this.musicContainer?.classList.add('play');
    this.pistaFile?.play();
    if (this.playButton) this.playButton.style.display = 'none';
    if (this.pauseButton) this.pauseButton!.style.display = 'inline';
  }

  pauseSong() {
    this.musicContainer?.classList.remove('play');
    this.pistaFile?.pause();
    if (this.playButton) this.playButton.style.display = 'inline';
    if (this.pauseButton) this.pauseButton!.style.display = 'none';
  }

  updateProgress(event: Event) {
    this.progressTime!.innerText = this.formatTime(this.pistaFile!.currentTime);
    const duration = (<HTMLAudioElement>event.target).duration;
    const currentTime = (<HTMLAudioElement>event.target).currentTime;
    const progressPercent = (currentTime / duration) * 100;
    const progressElement = document.querySelector('.progresss')!;
    const progressCirle = document.querySelector('.progress-circle')!;
    progressElement.setAttribute('style', `width: ${progressPercent}%`);
    progressCirle.setAttribute('style', `left: ${progressPercent}%`);
  }

  setProgress(event: Event) {
    const width = (<HTMLDivElement>event.target).clientWidth;
    const clickX = (<MouseEvent>event).offsetX;
    const duration = this.pistaFile!.duration;
    this.pistaFile!.currentTime = (clickX / width) * duration;
  }

  prevSong() {
    if (this.pistaFile?.getAttribute('src') === '') {
      return;
    }
    this.songIndex--;
    console.log(this.songIndex);
    if (this.songIndex < 0) {
      this.songIndex = this.songsList.length - 1;
    }
    this.loadSong(this.songsList[this.songIndex]);
    this.playSong();
  }
  nextSong() {
    if (this.pistaFile?.getAttribute('src') === '') {
      return;
    }
    this.songIndex++;
    console.log(this.songIndex);

    if (this.songIndex == this.songsList.length) {
      this.songIndex = 0;
    }
    this.loadSong(this.songsList[this.songIndex]);
    this.playSong();
  }

  formatTime(sec: number): string {
    let min = Math.floor(sec / 60);
    sec = sec % 60;

    if (min >= 60) {
      let hour = Math.floor(min / 60);
      min = min % 60;
      return (
        this.formatNumber(hour) +
        ':' +
        this.formatNumber(min) +
        ':' +
        this.formatNumber(Number.parseInt(sec.toFixed(0)))
      );
    }
    return (
      this.formatNumber(min) +
      ':' +
      this.formatNumber(Number.parseInt(sec.toFixed(0)))
    );
  }

  formatNumber(number: number): string {
    let cadena: string = number.toString();
    if (number < 10) {
      cadena = '0' + number;
    }
    return cadena;
  }
}
