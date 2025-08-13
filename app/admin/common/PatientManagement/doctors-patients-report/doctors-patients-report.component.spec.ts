import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsPatientsReportComponent } from './doctors-patients-report.component';

describe('DoctorsPatientsReportComponent', () => {
  let component: DoctorsPatientsReportComponent;
  let fixture: ComponentFixture<DoctorsPatientsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorsPatientsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorsPatientsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
