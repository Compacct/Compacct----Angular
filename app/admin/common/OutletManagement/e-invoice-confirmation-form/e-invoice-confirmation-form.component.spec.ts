import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EInvoiceConfirmationFormComponent } from './e-invoice-confirmation-form.component';

describe('EInvoiceConfirmationFormComponent', () => {
  let component: EInvoiceConfirmationFormComponent;
  let fixture: ComponentFixture<EInvoiceConfirmationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EInvoiceConfirmationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EInvoiceConfirmationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
