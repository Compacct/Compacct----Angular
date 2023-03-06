import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TinnitusTherapyTrackerDashboardComponent } from './tinnitus-therapy-tracker-dashboard.component';

describe('TinnitusTherapyTrackerDashboardComponent', () => {
  let component: TinnitusTherapyTrackerDashboardComponent;
  let fixture: ComponentFixture<TinnitusTherapyTrackerDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TinnitusTherapyTrackerDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TinnitusTherapyTrackerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
