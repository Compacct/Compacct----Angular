import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletPhysicalClosingStockComponent } from './outlet-physical-closing-stock.component';

describe('OutletPhysicalClosingStockComponent', () => {
  let component: OutletPhysicalClosingStockComponent;
  let fixture: ComponentFixture<OutletPhysicalClosingStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutletPhysicalClosingStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletPhysicalClosingStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
