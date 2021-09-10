import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoAccCashBankConfirmComponent } from './tuto-acc-cash-bank-confirm.component';

describe('TutoAccCashBankConfirmComponent', () => {
  let component: TutoAccCashBankConfirmComponent;
  let fixture: ComponentFixture<TutoAccCashBankConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoAccCashBankConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoAccCashBankConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
