import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsAppointmentNewTinnitusTherapyTrackerComponent } from './doctors-appointment-new-tinnitus-therapy-tracker.component';

describe('DoctorsAppointmentNewTinnitusTherapyTrackerComponent', () => {
  let component: DoctorsAppointmentNewTinnitusTherapyTrackerComponent;
  let fixture: ComponentFixture<DoctorsAppointmentNewTinnitusTherapyTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorsAppointmentNewTinnitusTherapyTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorsAppointmentNewTinnitusTherapyTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
