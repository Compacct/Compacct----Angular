import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cInternalStockTransferNewComponent } from './k4c-internal-stock-transfer-new.component';

describe('K4cInternalStockTransferNewComponent', () => {
  let component: K4cInternalStockTransferNewComponent;
  let fixture: ComponentFixture<K4cInternalStockTransferNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cInternalStockTransferNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cInternalStockTransferNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
