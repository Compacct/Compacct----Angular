import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CompacctChartComponent } from "./compacct-chart.component";

describe("CompacctChartComponent", () => {
  let component: CompacctChartComponent;
  let fixture: ComponentFixture<CompacctChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompacctChartComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
