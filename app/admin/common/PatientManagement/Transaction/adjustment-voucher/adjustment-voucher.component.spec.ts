import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentVoucherComponent } from './adjustment-voucher.component';

describe('AdjustmentVoucherComponent', () => {
  let component: AdjustmentVoucherComponent;
  let fixture: ComponentFixture<AdjustmentVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustmentVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustmentVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
