import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletStockTransferAutoBatchComponent } from './outlet-stock-transfer-auto-batch.component';

describe('OutletStockTransferAutoBatchComponent', () => {
  let component: OutletStockTransferAutoBatchComponent;
  let fixture: ComponentFixture<OutletStockTransferAutoBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutletStockTransferAutoBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletStockTransferAutoBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
