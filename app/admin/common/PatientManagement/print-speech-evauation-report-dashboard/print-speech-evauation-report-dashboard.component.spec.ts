import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSpeechEvauationReportDashboardComponent } from './print-speech-evauation-report-dashboard.component';

describe('PrintSpeechEvauationReportDashboardComponent', () => {
  let component: PrintSpeechEvauationReportDashboardComponent;
  let fixture: ComponentFixture<PrintSpeechEvauationReportDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintSpeechEvauationReportDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintSpeechEvauationReportDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
