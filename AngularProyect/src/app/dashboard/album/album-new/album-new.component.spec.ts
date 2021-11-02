import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumNewComponent } from './album-new.component';

describe('AlbumNewComponent', () => {
  let component: AlbumNewComponent;
  let fixture: ComponentFixture<AlbumNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlbumNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
