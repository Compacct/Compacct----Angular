import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrLoanApplicationComponent } from './hr-loan-application.component';

describe('HrLoanApplicationComponent', () => {
  let component: HrLoanApplicationComponent;
  let fixture: ComponentFixture<HrLoanApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrLoanApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrLoanApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
