import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cDepartmentWiseRequisitionComponent } from './k4c-department-wise-requisition.component';

describe('K4cDepartmentWiseRequisitionComponent', () => {
  let component: K4cDepartmentWiseRequisitionComponent;
  let fixture: ComponentFixture<K4cDepartmentWiseRequisitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cDepartmentWiseRequisitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cDepartmentWiseRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
