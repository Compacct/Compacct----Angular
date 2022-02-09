import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoSupportCalenderDashboardComponent } from './tuto-support-calender-dashboard.component';

describe('TutoSupportCalenderDashboardComponent', () => {
  let component: TutoSupportCalenderDashboardComponent;
  let fixture: ComponentFixture<TutoSupportCalenderDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoSupportCalenderDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoSupportCalenderDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
