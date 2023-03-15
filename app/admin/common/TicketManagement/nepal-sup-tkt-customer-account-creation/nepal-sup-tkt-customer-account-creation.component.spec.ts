import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NepalSupTktCustomerAccountCreationComponent } from './nepal-sup-tkt-customer-account-creation.component';

describe('NepalSupTktCustomerAccountCreationComponent', () => {
  let component: NepalSupTktCustomerAccountCreationComponent;
  let fixture: ComponentFixture<NepalSupTktCustomerAccountCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NepalSupTktCustomerAccountCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NepalSupTktCustomerAccountCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
