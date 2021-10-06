import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardLargeComponent } from './card-large.component';

describe('CardLargeComponent', () => {
  let component: CardLargeComponent;
  let fixture: ComponentFixture<CardLargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardLargeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardLargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
