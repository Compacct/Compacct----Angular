import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponCreationComponent } from './coupon-creation.component';

describe('CouponCreationComponent', () => {
  let component: CouponCreationComponent;
  let fixture: ComponentFixture<CouponCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
