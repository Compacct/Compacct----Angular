import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyAttendanceSheetComponent } from './daily-attendance-sheet.component';

describe('DailyAttendanceSheetComponent', () => {
  let component: DailyAttendanceSheetComponent;
  let fixture: ComponentFixture<DailyAttendanceSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyAttendanceSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyAttendanceSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
