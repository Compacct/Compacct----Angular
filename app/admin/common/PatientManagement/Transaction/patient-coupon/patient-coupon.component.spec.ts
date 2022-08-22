import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCouponComponent } from './patient-coupon.component';

describe('PatientCouponComponent', () => {
  let component: PatientCouponComponent;
  let fixture: ComponentFixture<PatientCouponComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientCouponComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientCouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
