import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cPremixItemClosingStockComponent } from './k4c-premix-item-closing-stock.component';

describe('K4cPremixItemClosingStockComponent', () => {
  let component: K4cPremixItemClosingStockComponent;
  let fixture: ComponentFixture<K4cPremixItemClosingStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cPremixItemClosingStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cPremixItemClosingStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
