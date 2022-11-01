import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderRawMaterialComponent } from './purchase-order-raw-material.component';

describe('PurchaseOrderRawMaterialComponent', () => {
  let component: PurchaseOrderRawMaterialComponent;
  let fixture: ComponentFixture<PurchaseOrderRawMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrderRawMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderRawMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
