import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyAttendanceForContractorComponent } from './daily-attendance-for-contractor.component';

describe('DailyAttendanceForContractorComponent', () => {
  let component: DailyAttendanceForContractorComponent;
  let fixture: ComponentFixture<DailyAttendanceForContractorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyAttendanceForContractorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyAttendanceForContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
