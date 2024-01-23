import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaInvoiceComponent } from './proforma-invoice.component';

describe('ProformaInvoiceComponent', () => {
  let component: ProformaInvoiceComponent;
  let fixture: ComponentFixture<ProformaInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProformaInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProformaInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
