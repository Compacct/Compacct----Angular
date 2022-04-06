import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceSheetComponent } from './attendance-sheet.component';

describe('AttendanceSheetComponent', () => {
  let component: AttendanceSheetComponent;
  let fixture: ComponentFixture<AttendanceSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
