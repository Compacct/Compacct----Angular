import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialVoucherComponent } from './financial-voucher.component';

describe('FinancialVoucherComponent', () => {
  let component: FinancialVoucherComponent;
  let fixture: ComponentFixture<FinancialVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
