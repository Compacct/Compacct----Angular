import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cInternalStockTransferComponent } from './k4c-internal-stock-transfer.component';

describe('K4cInternalStockTransferComponent', () => {
  let component: K4cInternalStockTransferComponent;
  let fixture: ComponentFixture<K4cInternalStockTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cInternalStockTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cInternalStockTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
