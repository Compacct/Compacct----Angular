import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubContractorAttendanceComponent } from './sub-contractor-attendance.component';

describe('SubContractorAttendanceComponent', () => {
  let component: SubContractorAttendanceComponent;
  let fixture: ComponentFixture<SubContractorAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubContractorAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubContractorAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
