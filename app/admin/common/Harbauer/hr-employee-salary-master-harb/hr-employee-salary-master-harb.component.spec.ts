import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrEmployeeSalaryMasterHarbComponent } from './hr-employee-salary-master-harb.component';

describe('HrEmployeeSalaryMasterHarbComponent', () => {
  let component: HrEmployeeSalaryMasterHarbComponent;
  let fixture: ComponentFixture<HrEmployeeSalaryMasterHarbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrEmployeeSalaryMasterHarbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrEmployeeSalaryMasterHarbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
