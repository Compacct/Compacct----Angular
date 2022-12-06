import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NepalPurchaseOrderDocumenMasterComponent } from './nepal-purchase-order-documen-master.component';

describe('NepalPurchaseOrderDocumenMasterComponent', () => {
  let component: NepalPurchaseOrderDocumenMasterComponent;
  let fixture: ComponentFixture<NepalPurchaseOrderDocumenMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NepalPurchaseOrderDocumenMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NepalPurchaseOrderDocumenMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
