import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmReportV2Component } from './crm-report-v2.component';

describe('CrmReportV2Component', () => {
  let component: CrmReportV2Component;
  let fixture: ComponentFixture<CrmReportV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmReportV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmReportV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
