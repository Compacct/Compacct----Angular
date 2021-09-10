import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletTxnBankDepositComponent } from './outlet-txn-bank-deposit.component';

describe('OutletTxnBankDepositComponent', () => {
  let component: OutletTxnBankDepositComponent;
  let fixture: ComponentFixture<OutletTxnBankDepositComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutletTxnBankDepositComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletTxnBankDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
