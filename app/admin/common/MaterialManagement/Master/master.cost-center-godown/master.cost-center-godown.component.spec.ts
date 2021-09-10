import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MasterCostCenterGodownComponent } from "./master.cost-center-godown.component";

describe("MasterCostCenterGodownComponent", () => {
  let component: MasterCostCenterGodownComponent;
  let fixture: ComponentFixture<MasterCostCenterGodownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MasterCostCenterGodownComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterCostCenterGodownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
