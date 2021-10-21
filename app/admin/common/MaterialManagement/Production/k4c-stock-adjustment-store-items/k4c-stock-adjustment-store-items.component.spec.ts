import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cStockAdjustmentStoreItemsComponent } from './k4c-stock-adjustment-store-items.component';

describe('K4cStockAdjustmentStoreItemsComponent', () => {
  let component: K4cStockAdjustmentStoreItemsComponent;
  let fixture: ComponentFixture<K4cStockAdjustmentStoreItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cStockAdjustmentStoreItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cStockAdjustmentStoreItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
