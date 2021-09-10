import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoPaymentLinkComponent } from './tuto-payment-link.component';

describe('TutoPaymentLinkComponent', () => {
  let component: TutoPaymentLinkComponent;
  let fixture: ComponentFixture<TutoPaymentLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoPaymentLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoPaymentLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
