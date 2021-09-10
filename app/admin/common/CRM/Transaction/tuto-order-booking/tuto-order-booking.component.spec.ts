import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoOrderBookingComponent } from './tuto-order-booking.component';

describe('TutoOrderBookingComponent', () => {
  let component: TutoOrderBookingComponent;
  let fixture: ComponentFixture<TutoOrderBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoOrderBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoOrderBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
