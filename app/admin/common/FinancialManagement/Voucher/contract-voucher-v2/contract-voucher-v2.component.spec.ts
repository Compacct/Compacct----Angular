import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractVoucherV2Component } from './contract-voucher-v2.component';

describe('ContractVoucherV2Component', () => {
  let component: ContractVoucherV2Component;
  let fixture: ComponentFixture<ContractVoucherV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractVoucherV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractVoucherV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
