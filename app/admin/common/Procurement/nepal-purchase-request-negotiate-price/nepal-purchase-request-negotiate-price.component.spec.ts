import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NepalPurchaseRequestNegotiatePriceComponent } from './nepal-purchase-request-negotiate-price.component';

describe('NepalPurchaseRequestNegotiatePriceComponent', () => {
  let component: NepalPurchaseRequestNegotiatePriceComponent;
  let fixture: ComponentFixture<NepalPurchaseRequestNegotiatePriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NepalPurchaseRequestNegotiatePriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NepalPurchaseRequestNegotiatePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
