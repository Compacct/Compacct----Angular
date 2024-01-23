import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintTinnitusTherapyTrackerDashboardComponent } from './print-tinnitus-therapy-tracker-dashboard.component';

describe('PrintTinnitusTherapyTrackerDashboardComponent', () => {
  let component: PrintTinnitusTherapyTrackerDashboardComponent;
  let fixture: ComponentFixture<PrintTinnitusTherapyTrackerDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintTinnitusTherapyTrackerDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintTinnitusTherapyTrackerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
