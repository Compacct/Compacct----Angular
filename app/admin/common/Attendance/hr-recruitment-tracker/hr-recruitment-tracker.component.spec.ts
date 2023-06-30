import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrRecruitmentTrackerComponent } from './hr-recruitment-tracker.component';

describe('HrRecruitmentTrackerComponent', () => {
  let component: HrRecruitmentTrackerComponent;
  let fixture: ComponentFixture<HrRecruitmentTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrRecruitmentTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrRecruitmentTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
