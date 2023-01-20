import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsAppointmentNewFineTuningHearingComponent } from './doctors-appointment-new-fine-tuning-hearing.component';

describe('DoctorsAppointmentNewFineTuningHearingComponent', () => {
  let component: DoctorsAppointmentNewFineTuningHearingComponent;
  let fixture: ComponentFixture<DoctorsAppointmentNewFineTuningHearingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorsAppointmentNewFineTuningHearingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorsAppointmentNewFineTuningHearingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
