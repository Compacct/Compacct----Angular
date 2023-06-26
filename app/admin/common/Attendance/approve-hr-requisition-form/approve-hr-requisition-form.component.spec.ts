import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveHrRequisitionFormComponent } from './approve-hr-requisition-form.component';

describe('ApproveHrRequisitionFormComponent', () => {
  let component: ApproveHrRequisitionFormComponent;
  let fixture: ComponentFixture<ApproveHrRequisitionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveHrRequisitionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveHrRequisitionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
