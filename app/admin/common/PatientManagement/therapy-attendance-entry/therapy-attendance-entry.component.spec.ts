import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapyAttendanceEntryComponent } from './therapy-attendance-entry.component';

describe('TherapyAttendanceEntryComponent', () => {
  let component: TherapyAttendanceEntryComponent;
  let fixture: ComponentFixture<TherapyAttendanceEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TherapyAttendanceEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TherapyAttendanceEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
