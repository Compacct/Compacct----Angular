import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosingStockWithExpiryDateComponent } from './closing-stock-with-expiry-date.component';

describe('ClosingStockWithExpiryDateComponent', () => {
  let component: ClosingStockWithExpiryDateComponent;
  let fixture: ComponentFixture<ClosingStockWithExpiryDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClosingStockWithExpiryDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosingStockWithExpiryDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
