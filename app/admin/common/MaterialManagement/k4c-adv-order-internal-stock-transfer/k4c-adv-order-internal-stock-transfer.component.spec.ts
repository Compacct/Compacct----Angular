import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cAdvOrderInternalStockTransferComponent } from './k4c-adv-order-internal-stock-transfer.component';

describe('K4cAdvOrderInternalStockTransferComponent', () => {
  let component: K4cAdvOrderInternalStockTransferComponent;
  let fixture: ComponentFixture<K4cAdvOrderInternalStockTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cAdvOrderInternalStockTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cAdvOrderInternalStockTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
