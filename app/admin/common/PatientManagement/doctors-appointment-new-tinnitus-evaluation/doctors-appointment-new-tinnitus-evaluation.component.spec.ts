import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsAppointmentNewTinnitusEvaluationComponent } from './doctors-appointment-new-tinnitus-evaluation.component';

describe('DoctorsAppointmentNewTinnitusEvaluationComponent', () => {
  let component: DoctorsAppointmentNewTinnitusEvaluationComponent;
  let fixture: ComponentFixture<DoctorsAppointmentNewTinnitusEvaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorsAppointmentNewTinnitusEvaluationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorsAppointmentNewTinnitusEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
