import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HIPLPaymentRequisitionComponent } from './hipl-payment-requisition.component';

describe('HIPLPaymentRequisitionComponent', () => {
  let component: HIPLPaymentRequisitionComponent;
  let fixture: ComponentFixture<HIPLPaymentRequisitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HIPLPaymentRequisitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HIPLPaymentRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
