import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CompacctCostcenterComponent } from "./compacct.costcenter.component";

describe("CompacctCostcenterComponent", () => {
  let component: CompacctCostcenterComponent;
  let fixture: ComponentFixture<CompacctCostcenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompacctCostcenterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctCostcenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
