import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsAppointmentNewABRComponent } from './doctors-appointment-new-abr.component';

describe('DoctorsAppointmentNewABRComponent', () => {
  let component: DoctorsAppointmentNewABRComponent;
  let fixture: ComponentFixture<DoctorsAppointmentNewABRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorsAppointmentNewABRComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorsAppointmentNewABRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
