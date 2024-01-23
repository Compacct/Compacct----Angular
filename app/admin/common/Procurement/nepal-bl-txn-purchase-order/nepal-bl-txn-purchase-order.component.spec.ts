import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NepalBLTxnPurchaseOrderComponent } from './nepal-bl-txn-purchase-order.component';

describe('NepalBLTxnPurchaseOrderComponent', () => {
  let component: NepalBLTxnPurchaseOrderComponent;
  let fixture: ComponentFixture<NepalBLTxnPurchaseOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NepalBLTxnPurchaseOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NepalBLTxnPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
