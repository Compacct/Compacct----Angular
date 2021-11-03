import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cRsnsClosingStockComponent } from './k4c-rsns-closing-stock.component';

describe('K4cRsnsClosingStockComponent', () => {
  let component: K4cRsnsClosingStockComponent;
  let fixture: ComponentFixture<K4cRsnsClosingStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cRsnsClosingStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cRsnsClosingStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
