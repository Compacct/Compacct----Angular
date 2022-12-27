import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TinnitusEvauationReportDashboardComponent } from './tinnitus-evauation-report-dashboard.component';

describe('TinnitusEvauationReportDashboardComponent', () => {
  let component: TinnitusEvauationReportDashboardComponent;
  let fixture: ComponentFixture<TinnitusEvauationReportDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TinnitusEvauationReportDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TinnitusEvauationReportDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
