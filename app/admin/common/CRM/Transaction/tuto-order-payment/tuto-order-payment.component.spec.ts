import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoOrderPaymentComponent } from './tuto-order-payment.component';

describe('TutoOrderPaymentComponent', () => {
  let component: TutoOrderPaymentComponent;
  let fixture: ComponentFixture<TutoOrderPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoOrderPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoOrderPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
