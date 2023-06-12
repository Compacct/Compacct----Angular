import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceRegularizationComponent } from './attendance-regularization.component';

describe('AttendanceRegularizationComponent', () => {
  let component: AttendanceRegularizationComponent;
  let fixture: ComponentFixture<AttendanceRegularizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceRegularizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceRegularizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
