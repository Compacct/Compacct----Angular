import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchRequisitionComponent } from './branch-requisition.component';

describe('BranchRequisitionComponent', () => {
  let component: BranchRequisitionComponent;
  let fixture: ComponentFixture<BranchRequisitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchRequisitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
