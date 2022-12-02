import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorApptNewImpedanceAudiometryComponent } from './doctor-appt-new-impedance-audiometry.component';

describe('DoctorApptNewImpedanceAudiometryComponent', () => {
  let component: DoctorApptNewImpedanceAudiometryComponent;
  let fixture: ComponentFixture<DoctorApptNewImpedanceAudiometryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorApptNewImpedanceAudiometryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorApptNewImpedanceAudiometryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
