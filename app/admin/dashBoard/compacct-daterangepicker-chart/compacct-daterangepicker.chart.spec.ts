import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CompacctDaterangepickerChartComponent } from "./compacct-daterangepicker.chart";

describe("CompacctDaterangepickerComponent", () => {
  let component: CompacctDaterangepickerChartComponent;
  let fixture: ComponentFixture<CompacctDaterangepickerChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompacctDaterangepickerChartComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctDaterangepickerChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
