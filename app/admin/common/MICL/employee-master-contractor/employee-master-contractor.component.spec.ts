import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMasterContractorComponent } from './employee-master-contractor.component';

describe('EmployeeMasterContractorComponent', () => {
  let component: EmployeeMasterContractorComponent;
  let fixture: ComponentFixture<EmployeeMasterContractorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeMasterContractorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeMasterContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
