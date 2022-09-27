import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubContractorEmployeeMasterComponent } from './sub-contractor-employee-master.component';

describe('SubContractorEmployeeMasterComponent', () => {
  let component: SubContractorEmployeeMasterComponent;
  let fixture: ComponentFixture<SubContractorEmployeeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubContractorEmployeeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubContractorEmployeeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
