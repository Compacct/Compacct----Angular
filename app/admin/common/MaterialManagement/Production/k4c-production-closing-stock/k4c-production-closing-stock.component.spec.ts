import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cProductionClosingStockComponent } from './k4c-production-closing-stock.component';

describe('K4cProductionClosingStockComponent', () => {
  let component: K4cProductionClosingStockComponent;
  let fixture: ComponentFixture<K4cProductionClosingStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cProductionClosingStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cProductionClosingStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
