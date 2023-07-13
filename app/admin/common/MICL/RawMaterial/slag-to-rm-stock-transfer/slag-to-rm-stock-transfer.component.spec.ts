import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlagToRmStockTransferComponent } from './slag-to-rm-stock-transfer.component';

describe('SlagToRmStockTransferComponent', () => {
  let component: SlagToRmStockTransferComponent;
  let fixture: ComponentFixture<SlagToRmStockTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlagToRmStockTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlagToRmStockTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
