import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JohDailyAttendanceComponent } from './joh-daily-attendance.component';

describe('JohDailyAttendanceComponent', () => {
  let component: JohDailyAttendanceComponent;
  let fixture: ComponentFixture<JohDailyAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JohDailyAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JohDailyAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
