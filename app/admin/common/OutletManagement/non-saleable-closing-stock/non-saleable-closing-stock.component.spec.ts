import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonSaleableClosingStockComponent } from './non-saleable-closing-stock.component';

describe('NonSaleableClosingStockComponent', () => {
  let component: NonSaleableClosingStockComponent;
  let fixture: ComponentFixture<NonSaleableClosingStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonSaleableClosingStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonSaleableClosingStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
