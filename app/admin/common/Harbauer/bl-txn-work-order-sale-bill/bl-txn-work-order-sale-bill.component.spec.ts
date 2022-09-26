import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BLTxnWorkOrderSaleBillComponent } from './bl-txn-work-order-sale-bill.component';

describe('BLTxnWorkOrderSaleBillComponent', () => {
  let component: BLTxnWorkOrderSaleBillComponent;
  let fixture: ComponentFixture<BLTxnWorkOrderSaleBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BLTxnWorkOrderSaleBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BLTxnWorkOrderSaleBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
