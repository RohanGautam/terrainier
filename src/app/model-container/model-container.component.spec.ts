import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelContainerComponent } from './model-container.component';

describe('ModelContainerComponent', () => {
  let component: ModelContainerComponent;
  let fixture: ComponentFixture<ModelContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
