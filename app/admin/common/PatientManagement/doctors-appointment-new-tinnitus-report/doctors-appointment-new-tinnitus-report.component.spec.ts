import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsAppointmentNewTinnitusReportComponent } from './doctors-appointment-new-tinnitus-report.component';

describe('DoctorsAppointmentNewTinnitusReportComponent', () => {
  let component: DoctorsAppointmentNewTinnitusReportComponent;
  let fixture: ComponentFixture<DoctorsAppointmentNewTinnitusReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorsAppointmentNewTinnitusReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorsAppointmentNewTinnitusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
