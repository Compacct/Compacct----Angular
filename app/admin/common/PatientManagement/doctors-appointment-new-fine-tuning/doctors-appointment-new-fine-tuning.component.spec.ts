import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsAppointmentNewFineTuningComponent } from './doctors-appointment-new-fine-tuning.component';

describe('DoctorsAppointmentNewFineTuningComponent', () => {
  let component: DoctorsAppointmentNewFineTuningComponent;
  let fixture: ComponentFixture<DoctorsAppointmentNewFineTuningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorsAppointmentNewFineTuningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorsAppointmentNewFineTuningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
