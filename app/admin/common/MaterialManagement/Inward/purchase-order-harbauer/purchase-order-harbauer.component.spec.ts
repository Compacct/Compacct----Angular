import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderHarbauerComponent } from './purchase-order-harbauer.component';

describe('PurchaseOrderHarbauerComponent', () => {
  let component: PurchaseOrderHarbauerComponent;
  let fixture: ComponentFixture<PurchaseOrderHarbauerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrderHarbauerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderHarbauerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
