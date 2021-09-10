import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CompacctBillQcComponent } from "./compacct.bill.qc.component";

describe("CompacctBillQcComponent", () => {
  let component: CompacctBillQcComponent;
  let fixture: ComponentFixture<CompacctBillQcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompacctBillQcComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctBillQcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
