import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTransferTankComponent } from './stock-transfer-tank.component';

describe('StockTransferTankComponent', () => {
  let component: StockTransferTankComponent;
  let fixture: ComponentFixture<StockTransferTankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockTransferTankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockTransferTankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
