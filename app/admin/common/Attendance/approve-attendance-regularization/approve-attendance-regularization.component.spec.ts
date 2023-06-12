import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveAttendanceRegularizationComponent } from './approve-attendance-regularization.component';

describe('ApproveAttendanceRegularizationComponent', () => {
  let component: ApproveAttendanceRegularizationComponent;
  let fixture: ComponentFixture<ApproveAttendanceRegularizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveAttendanceRegularizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveAttendanceRegularizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
