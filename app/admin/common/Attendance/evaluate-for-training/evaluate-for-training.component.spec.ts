import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateForTrainingComponent } from './evaluate-for-training.component';

describe('EvaluateForTrainingComponent', () => {
  let component: EvaluateForTrainingComponent;
  let fixture: ComponentFixture<EvaluateForTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluateForTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateForTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
