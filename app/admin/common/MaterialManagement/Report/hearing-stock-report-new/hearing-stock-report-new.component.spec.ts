import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HearingStockReportNewComponent } from './hearing-stock-report-new.component';

describe('HearingStockReportNewComponent', () => {
  let component: HearingStockReportNewComponent;
  let fixture: ComponentFixture<HearingStockReportNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HearingStockReportNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HearingStockReportNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
