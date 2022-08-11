import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSalaryMasterMiclComponent } from './employee-salary-master-micl.component';

describe('EmployeeSalaryMasterMiclComponent', () => {
  let component: EmployeeSalaryMasterMiclComponent;
  let fixture: ComponentFixture<EmployeeSalaryMasterMiclComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeSalaryMasterMiclComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSalaryMasterMiclComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
