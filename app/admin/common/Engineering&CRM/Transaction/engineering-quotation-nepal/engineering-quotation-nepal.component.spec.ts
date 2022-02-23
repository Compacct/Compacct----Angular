import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineeringQuotationNepalComponent } from './engineering-quotation-nepal.component';

describe('EngineeringQuotationNepalComponent', () => {
  let component: EngineeringQuotationNepalComponent;
  let fixture: ComponentFixture<EngineeringQuotationNepalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngineeringQuotationNepalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineeringQuotationNepalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
