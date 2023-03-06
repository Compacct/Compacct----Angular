import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsAppointmentNewTinnitusHandicapComponent } from './doctors-appointment-new-tinnitus-handicap.component';

describe('DoctorsAppointmentNewTinnitusHandicapComponent', () => {
  let component: DoctorsAppointmentNewTinnitusHandicapComponent;
  let fixture: ComponentFixture<DoctorsAppointmentNewTinnitusHandicapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorsAppointmentNewTinnitusHandicapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorsAppointmentNewTinnitusHandicapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
