import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoManualPaymentCollectionComponent } from './tuto-manual-payment-collection.component';

describe('TutoManualPaymentCollectionComponent', () => {
  let component: TutoManualPaymentCollectionComponent;
  let fixture: ComponentFixture<TutoManualPaymentCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoManualPaymentCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoManualPaymentCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
