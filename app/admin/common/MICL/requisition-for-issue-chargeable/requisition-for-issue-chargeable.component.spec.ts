import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionForIssueChargeableComponent } from './requisition-for-issue-chargeable.component';

describe('RequisitionForIssueChargeableComponent', () => {
  let component: RequisitionForIssueChargeableComponent;
  let fixture: ComponentFixture<RequisitionForIssueChargeableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequisitionForIssueChargeableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionForIssueChargeableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
