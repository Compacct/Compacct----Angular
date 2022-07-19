import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HRTxnSpecialAllowanceDeductionComponent } from './hr-txn-special-allowance-deduction.component';

describe('HRTxnSpecialAllowanceDeductionComponent', () => {
  let component: HRTxnSpecialAllowanceDeductionComponent;
  let fixture: ComponentFixture<HRTxnSpecialAllowanceDeductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HRTxnSpecialAllowanceDeductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HRTxnSpecialAllowanceDeductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
