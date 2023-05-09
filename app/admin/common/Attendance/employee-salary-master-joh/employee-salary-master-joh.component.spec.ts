import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSalaryMasterJohComponent } from './employee-salary-master-joh.component';

describe('EmployeeSalaryMasterJohComponent', () => {
  let component: EmployeeSalaryMasterJohComponent;
  let fixture: ComponentFixture<EmployeeSalaryMasterJohComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeSalaryMasterJohComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSalaryMasterJohComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
