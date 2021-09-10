import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoLoanConfirmationComponent } from './tuto-loan-confirmation.component';

describe('TutoLoanConfirmationComponent', () => {
  let component: TutoLoanConfirmationComponent;
  let fixture: ComponentFixture<TutoLoanConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoLoanConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoLoanConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
