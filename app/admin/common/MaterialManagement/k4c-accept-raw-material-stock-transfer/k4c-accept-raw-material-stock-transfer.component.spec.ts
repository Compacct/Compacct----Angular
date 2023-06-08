import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cAcceptRawMaterialStockTransferComponent } from './k4c-accept-raw-material-stock-transfer.component';

describe('K4cAcceptRawMaterialStockTransferComponent', () => {
  let component: K4cAcceptRawMaterialStockTransferComponent;
  let fixture: ComponentFixture<K4cAcceptRawMaterialStockTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cAcceptRawMaterialStockTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cAcceptRawMaterialStockTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
