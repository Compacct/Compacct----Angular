import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NepalPurchaseOrderStatusMasterComponent } from './nepal-purchase-order-status-master.component';

describe('NepalPurchaseOrderStatusMasterComponent', () => {
  let component: NepalPurchaseOrderStatusMasterComponent;
  let fixture: ComponentFixture<NepalPurchaseOrderStatusMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NepalPurchaseOrderStatusMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NepalPurchaseOrderStatusMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
