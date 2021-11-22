import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistUpdateComponent } from './playlist-update.component';

describe('PlaylistUpdateComponent', () => {
  let component: PlaylistUpdateComponent;
  let fixture: ComponentFixture<PlaylistUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaylistUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
