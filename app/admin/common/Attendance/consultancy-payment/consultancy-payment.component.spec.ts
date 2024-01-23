import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultancyPaymentComponent } from './consultancy-payment.component';

describe('ConsultancyPaymentComponent', () => {
  let component: ConsultancyPaymentComponent;
  let fixture: ComponentFixture<ConsultancyPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultancyPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultancyPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
