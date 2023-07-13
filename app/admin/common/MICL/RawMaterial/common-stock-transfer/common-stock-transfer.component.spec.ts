import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonStockTransferComponent } from './common-stock-transfer.component';

describe('CommonStockTransferComponent', () => {
  let component: CommonStockTransferComponent;
  let fixture: ComponentFixture<CommonStockTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonStockTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonStockTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
