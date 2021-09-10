import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveStockAdjustmentComponent } from './receive-stock-adjustment.component';

describe('ReceiveStockAdjustmentComponent', () => {
  let component: ReceiveStockAdjustmentComponent;
  let fixture: ComponentFixture<ReceiveStockAdjustmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveStockAdjustmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveStockAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
