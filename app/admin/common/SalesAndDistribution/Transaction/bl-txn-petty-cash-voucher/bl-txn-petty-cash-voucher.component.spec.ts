import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlTxnPettyCashVoucherComponent } from './bl-txn-petty-cash-voucher.component';

describe('BlTxnPettyCashVoucherComponent', () => {
  let component: BlTxnPettyCashVoucherComponent;
  let fixture: ComponentFixture<BlTxnPettyCashVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlTxnPettyCashVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlTxnPettyCashVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
