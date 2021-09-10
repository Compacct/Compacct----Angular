import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletStockTransferComponent } from './outlet-stock-transfer.component';

describe('OutletStockTransferComponent', () => {
  let component: OutletStockTransferComponent;
  let fixture: ComponentFixture<OutletStockTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutletStockTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletStockTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
