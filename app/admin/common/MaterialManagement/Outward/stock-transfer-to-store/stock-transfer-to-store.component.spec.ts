import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTransferToStoreComponent } from './stock-transfer-to-store.component';

describe('StockTransferToStoreComponent', () => {
  let component: StockTransferToStoreComponent;
  let fixture: ComponentFixture<StockTransferToStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockTransferToStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockTransferToStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
