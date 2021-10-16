import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoBdaReportComponent } from './tuto-bda-report.component';

describe('TutoBdaReportComponent', () => {
  let component: TutoBdaReportComponent;
  let fixture: ComponentFixture<TutoBdaReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoBdaReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoBdaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
