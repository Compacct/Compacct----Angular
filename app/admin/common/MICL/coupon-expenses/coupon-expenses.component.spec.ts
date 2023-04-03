import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponExpensesComponent } from './coupon-expenses.component';

describe('CouponExpensesComponent', () => {
  let component: CouponExpensesComponent;
  let fixture: ComponentFixture<CouponExpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponExpensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
