import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumUpdateComponent } from './album-update.component';

describe('AlbumUpdateComponent', () => {
  let component: AlbumUpdateComponent;
  let fixture: ComponentFixture<AlbumUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlbumUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
