import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsAppointmentNewOAEComponent } from './doctors-appointment-new-oae.component';

describe('DoctorsAppointmentNewOAEComponent', () => {
  let component: DoctorsAppointmentNewOAEComponent;
  let fixture: ComponentFixture<DoctorsAppointmentNewOAEComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorsAppointmentNewOAEComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorsAppointmentNewOAEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
