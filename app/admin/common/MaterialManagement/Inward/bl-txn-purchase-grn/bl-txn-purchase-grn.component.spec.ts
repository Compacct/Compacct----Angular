import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlTxnPurchaseGrnComponent } from './bl-txn-purchase-grn.component';

describe('BlTxnPurchaseGrnComponent', () => {
  let component: BlTxnPurchaseGrnComponent;
  let fixture: ComponentFixture<BlTxnPurchaseGrnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlTxnPurchaseGrnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlTxnPurchaseGrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
