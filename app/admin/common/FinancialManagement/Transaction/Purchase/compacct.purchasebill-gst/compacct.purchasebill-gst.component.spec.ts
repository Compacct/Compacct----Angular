import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CompacctPurchasebillGstComponent } from "./compacct.purchasebill-gst.component";

describe("CompacctPurchasebillGstComponent", () => {
  let component: CompacctPurchasebillGstComponent;
  let fixture: ComponentFixture<CompacctPurchasebillGstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompacctPurchasebillGstComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctPurchasebillGstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
