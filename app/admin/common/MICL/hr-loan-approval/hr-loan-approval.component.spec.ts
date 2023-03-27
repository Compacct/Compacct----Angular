import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrLoanApprovalComponent } from './hr-loan-approval.component';

describe('HrLoanApprovalComponent', () => {
  let component: HrLoanApprovalComponent;
  let fixture: ComponentFixture<HrLoanApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrLoanApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrLoanApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
