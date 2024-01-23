import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MICLCouponIssueComponent } from './micl-coupon-issue.component';

describe('MICLCouponIssueComponent', () => {
  let component: MICLCouponIssueComponent;
  let fixture: ComponentFixture<MICLCouponIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MICLCouponIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MICLCouponIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
