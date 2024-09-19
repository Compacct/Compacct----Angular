import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyReportingComponent } from './weekly-reporting.component';

describe('WeeklyReportingComponent', () => {
  let component: WeeklyReportingComponent;
  let fixture: ComponentFixture<WeeklyReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeeklyReportingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
