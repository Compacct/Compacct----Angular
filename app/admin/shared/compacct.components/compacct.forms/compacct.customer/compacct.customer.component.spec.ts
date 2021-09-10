import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CompacctCustomerComponent } from "./compacct.customer.component";

describe("CompacctCustomerComponent", () => {
  let component: CompacctCustomerComponent;
  let fixture: ComponentFixture<CompacctCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompacctCustomerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
