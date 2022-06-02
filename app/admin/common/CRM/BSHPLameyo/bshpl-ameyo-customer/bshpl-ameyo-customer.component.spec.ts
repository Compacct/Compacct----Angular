import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BSHPLAmeyoCustomerComponent } from './bshpl-ameyo-customer.component';

describe('BSHPLAmeyoCustomerComponent', () => {
  let component: BSHPLAmeyoCustomerComponent;
  let fixture: ComponentFixture<BSHPLAmeyoCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BSHPLAmeyoCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BSHPLAmeyoCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
