import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrRequisitionFormComponent } from './hr-requisition-form.component';

describe('HrRequisitionFormComponent', () => {
  let component: HrRequisitionFormComponent;
  let fixture: ComponentFixture<HrRequisitionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrRequisitionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrRequisitionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
