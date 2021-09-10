import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CompacctHearingThresholdChartComponent } from "./compacct.hearing.threshold-chart.component";

describe("CompacctHearingThresholdChartComponent", () => {
  let component: CompacctHearingThresholdChartComponent;
  let fixture: ComponentFixture<CompacctHearingThresholdChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompacctHearingThresholdChartComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctHearingThresholdChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
