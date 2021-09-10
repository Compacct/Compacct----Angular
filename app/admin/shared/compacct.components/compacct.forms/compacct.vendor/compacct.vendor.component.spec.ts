import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CompacctVendorComponent } from "./compacct.vendor.component";

describe("CompacctVendorComponent", () => {
  let component: CompacctVendorComponent;
  let fixture: ComponentFixture<CompacctVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompacctVendorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
