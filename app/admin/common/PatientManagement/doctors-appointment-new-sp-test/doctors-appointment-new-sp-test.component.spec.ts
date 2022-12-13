import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsAppointmentNewSpTestComponent } from './doctors-appointment-new-sp-test.component';

describe('DoctorsAppointmentNewSpTestComponent', () => {
  let component: DoctorsAppointmentNewSpTestComponent;
  let fixture: ComponentFixture<DoctorsAppointmentNewSpTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorsAppointmentNewSpTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorsAppointmentNewSpTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
