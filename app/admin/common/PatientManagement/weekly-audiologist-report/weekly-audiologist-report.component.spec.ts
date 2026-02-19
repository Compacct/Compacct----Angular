import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyAudiologistReportComponent } from './weekly-audiologist-report.component';

describe('WeeklyAudiologistReportComponent', () => {
  let component: WeeklyAudiologistReportComponent;
  let fixture: ComponentFixture<WeeklyAudiologistReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeeklyAudiologistReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyAudiologistReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
