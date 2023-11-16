import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyAttendanceJohForEmployeeComponent } from './daily-attendance-joh-for-employee.component';

describe('DailyAttendanceJohForEmployeeComponent', () => {
  let component: DailyAttendanceJohForEmployeeComponent;
  let fixture: ComponentFixture<DailyAttendanceJohForEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyAttendanceJohForEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyAttendanceJohForEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
