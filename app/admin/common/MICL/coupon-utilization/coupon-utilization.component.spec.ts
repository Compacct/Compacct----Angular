import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponUtilizationComponent } from './coupon-utilization.component';

describe('CouponUtilizationComponent', () => {
  let component: CouponUtilizationComponent;
  let fixture: ComponentFixture<CouponUtilizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponUtilizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponUtilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
