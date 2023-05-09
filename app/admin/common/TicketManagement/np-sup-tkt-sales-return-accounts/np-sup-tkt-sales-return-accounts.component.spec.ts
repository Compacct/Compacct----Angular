import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NPSupTktSalesReturnAccountsComponent } from './np-sup-tkt-sales-return-accounts.component';

describe('NPSupTktSalesReturnAccountsComponent', () => {
  let component: NPSupTktSalesReturnAccountsComponent;
  let fixture: ComponentFixture<NPSupTktSalesReturnAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NPSupTktSalesReturnAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NPSupTktSalesReturnAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
