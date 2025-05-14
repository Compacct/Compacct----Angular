import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BLTxnPurchaseBillFromGRNComponent } from './bl-txn-purchase-bill-from-grn.component';

describe('BLTxnPurchaseBillFromGRNComponent', () => {
  let component: BLTxnPurchaseBillFromGRNComponent;
  let fixture: ComponentFixture<BLTxnPurchaseBillFromGRNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BLTxnPurchaseBillFromGRNComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BLTxnPurchaseBillFromGRNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
