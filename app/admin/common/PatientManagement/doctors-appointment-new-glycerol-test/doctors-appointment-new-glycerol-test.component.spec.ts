import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsAppointmentNewGlycerolTestComponent } from './doctors-appointment-new-glycerol-test.component';

describe('DoctorsAppointmentNewGlycerolTestComponent', () => {
  let component: DoctorsAppointmentNewGlycerolTestComponent;
  let fixture: ComponentFixture<DoctorsAppointmentNewGlycerolTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorsAppointmentNewGlycerolTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorsAppointmentNewGlycerolTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
