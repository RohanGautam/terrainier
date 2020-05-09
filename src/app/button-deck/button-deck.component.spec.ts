import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonDeckComponent } from './button-deck.component';

describe('ButtonDeckComponent', () => {
  let component: ButtonDeckComponent;
  let fixture: ComponentFixture<ButtonDeckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonDeckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
