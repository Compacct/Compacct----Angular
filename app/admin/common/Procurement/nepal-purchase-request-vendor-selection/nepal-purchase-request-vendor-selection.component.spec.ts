import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NepalPurchaseRequestVendorSelectionComponent } from './nepal-purchase-request-vendor-selection.component';

describe('NepalPurchaseRequestVendorSelectionComponent', () => {
  let component: NepalPurchaseRequestVendorSelectionComponent;
  let fixture: ComponentFixture<NepalPurchaseRequestVendorSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NepalPurchaseRequestVendorSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NepalPurchaseRequestVendorSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
