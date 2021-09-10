import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CRMPaymentBankComponent } from './crm-payment-bank.component';

describe('CRMPaymentBankComponent', () => {
  let component: CRMPaymentBankComponent;
  let fixture: ComponentFixture<CRMPaymentBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CRMPaymentBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CRMPaymentBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
