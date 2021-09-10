import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cRawMaterialStockTransferComponent } from './k4c-raw-material-stock-transfer.component';

describe('K4cRawMaterialStockTransferComponent', () => {
  let component: K4cRawMaterialStockTransferComponent;
  let fixture: ComponentFixture<K4cRawMaterialStockTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cRawMaterialStockTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cRawMaterialStockTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
