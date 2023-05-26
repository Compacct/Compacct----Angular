import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrCouponReportComponent } from './hr-coupon-report.component';

describe('HrCouponReportComponent', () => {
  let component: HrCouponReportComponent;
  let fixture: ComponentFixture<HrCouponReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrCouponReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrCouponReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
