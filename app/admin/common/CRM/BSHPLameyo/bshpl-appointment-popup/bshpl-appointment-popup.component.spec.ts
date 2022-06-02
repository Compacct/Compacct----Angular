import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BSHPLAppointmentPopupComponent } from './bshpl-appointment-popup.component';

describe('BSHPLAppointmentPopupComponent', () => {
  let component: BSHPLAppointmentPopupComponent;
  let fixture: ComponentFixture<BSHPLAppointmentPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BSHPLAppointmentPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BSHPLAppointmentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
