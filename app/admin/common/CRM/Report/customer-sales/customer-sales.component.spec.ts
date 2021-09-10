import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSalesComponent } from './customer-sales.component';

describe('CustomerSalesComponent', () => {
  let component: CustomerSalesComponent;
  let fixture: ComponentFixture<CustomerSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
