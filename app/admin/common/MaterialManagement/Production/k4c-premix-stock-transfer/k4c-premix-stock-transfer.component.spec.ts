import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cPremixStockTransferComponent } from './k4c-premix-stock-transfer.component';

describe('K4cPremixStockTransferComponent', () => {
  let component: K4cPremixStockTransferComponent;
  let fixture: ComponentFixture<K4cPremixStockTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cPremixStockTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cPremixStockTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
