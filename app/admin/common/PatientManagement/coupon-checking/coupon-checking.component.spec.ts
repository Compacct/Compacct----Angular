import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponCheckingComponent } from './coupon-checking.component';

describe('CouponCheckingComponent', () => {
  let component: CouponCheckingComponent;
  let fixture: ComponentFixture<CouponCheckingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponCheckingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponCheckingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
