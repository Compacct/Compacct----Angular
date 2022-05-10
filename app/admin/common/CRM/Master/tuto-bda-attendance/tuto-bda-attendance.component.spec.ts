import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoBdaAttendanceComponent } from './tuto-bda-attendance.component';

describe('TutoBdaAttendanceComponent', () => {
  let component: TutoBdaAttendanceComponent;
  let fixture: ComponentFixture<TutoBdaAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoBdaAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoBdaAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
