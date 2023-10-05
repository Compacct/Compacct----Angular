import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRelatedReportComponent } from './employee-related-report.component';

describe('EmployeeRelatedReportComponent', () => {
  let component: EmployeeRelatedReportComponent;
  let fixture: ComponentFixture<EmployeeRelatedReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeRelatedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeRelatedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
