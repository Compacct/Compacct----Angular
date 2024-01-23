import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderHarbauerTermsComponent } from './purchase-order-harbauer-terms.component';

describe('PurchaseOrderHarbauerTermsComponent', () => {
  let component: PurchaseOrderHarbauerTermsComponent;
  let fixture: ComponentFixture<PurchaseOrderHarbauerTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrderHarbauerTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderHarbauerTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
