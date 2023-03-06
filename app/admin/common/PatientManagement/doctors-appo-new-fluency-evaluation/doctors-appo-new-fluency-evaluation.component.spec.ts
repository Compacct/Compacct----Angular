import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsAppoNewFluencyEvaluationComponent } from './doctors-appo-new-fluency-evaluation.component';

describe('DoctorsAppoNewFluencyEvaluationComponent', () => {
  let component: DoctorsAppoNewFluencyEvaluationComponent;
  let fixture: ComponentFixture<DoctorsAppoNewFluencyEvaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorsAppoNewFluencyEvaluationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorsAppoNewFluencyEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
