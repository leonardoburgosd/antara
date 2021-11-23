import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPistaComponent } from './card-pista.component';

describe('CardPistaComponent', () => {
  let component: CardPistaComponent;
  let fixture: ComponentFixture<CardPistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardPistaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardPistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
