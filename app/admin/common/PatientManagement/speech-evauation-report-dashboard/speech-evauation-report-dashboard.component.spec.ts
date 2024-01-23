import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechEvauationReportDashboardComponent } from './speech-evauation-report-dashboard.component';

describe('SpeechEvauationReportDashboardComponent', () => {
  let component: SpeechEvauationReportDashboardComponent;
  let fixture: ComponentFixture<SpeechEvauationReportDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeechEvauationReportDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeechEvauationReportDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
