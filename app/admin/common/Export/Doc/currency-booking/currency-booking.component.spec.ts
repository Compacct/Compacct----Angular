import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyBookingComponent } from './currency-booking.component';

describe('CurrencyBookingComponent', () => {
  let component: CurrencyBookingComponent;
  let fixture: ComponentFixture<CurrencyBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencyBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
