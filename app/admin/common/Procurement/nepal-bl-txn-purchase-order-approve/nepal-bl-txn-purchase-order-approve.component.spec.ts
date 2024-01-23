import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NepalBLTxnPurchaseOrderApproveComponent } from './nepal-bl-txn-purchase-order-approve.component';

describe('NepalBLTxnPurchaseOrderApproveComponent', () => {
  let component: NepalBLTxnPurchaseOrderApproveComponent;
  let fixture: ComponentFixture<NepalBLTxnPurchaseOrderApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NepalBLTxnPurchaseOrderApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NepalBLTxnPurchaseOrderApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
