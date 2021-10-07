import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletClosingStockWithBatchComponent } from './outlet-closing-stock-with-batch.component';

describe('OutletClosingStockWithBatchComponent', () => {
  let component: OutletClosingStockWithBatchComponent;
  let fixture: ComponentFixture<OutletClosingStockWithBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutletClosingStockWithBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletClosingStockWithBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
