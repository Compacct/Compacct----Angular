import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectPaymentFollowupNepalComponent } from './direct-payment-followup-nepal.component';

describe('DirectPaymentFollowupNepalComponent', () => {
  let component: DirectPaymentFollowupNepalComponent;
  let fixture: ComponentFixture<DirectPaymentFollowupNepalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectPaymentFollowupNepalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectPaymentFollowupNepalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
