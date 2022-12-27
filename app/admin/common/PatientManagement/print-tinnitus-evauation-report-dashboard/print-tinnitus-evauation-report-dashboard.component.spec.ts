import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintTinnitusEvauationReportDashboardComponent } from './print-tinnitus-evauation-report-dashboard.component';

describe('PrintTinnitusEvauationReportDashboardComponent', () => {
  let component: PrintTinnitusEvauationReportDashboardComponent;
  let fixture: ComponentFixture<PrintTinnitusEvauationReportDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintTinnitusEvauationReportDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintTinnitusEvauationReportDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
