import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HearingSpeechAppointmentComponent } from './hearing-speech-appointment.component';

describe('HearingSpeechAppointmentComponent', () => {
  let component: HearingSpeechAppointmentComponent;
  let fixture: ComponentFixture<HearingSpeechAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HearingSpeechAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HearingSpeechAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
