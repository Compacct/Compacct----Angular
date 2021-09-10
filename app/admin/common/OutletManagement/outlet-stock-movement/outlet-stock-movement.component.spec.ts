import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletStockMovementComponent } from './outlet-stock-movement.component';

describe('OutletStockMovementComponent', () => {
  let component: OutletStockMovementComponent;
  let fixture: ComponentFixture<OutletStockMovementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutletStockMovementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletStockMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
