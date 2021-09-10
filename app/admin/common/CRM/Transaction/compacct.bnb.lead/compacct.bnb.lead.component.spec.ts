import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CompacctBnbLeadComponent } from "./compacct.bnb.lead.component";

describe("CompacctBnbLeadComponent", () => {
  let component: CompacctBnbLeadComponent;
  let fixture: ComponentFixture<CompacctBnbLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompacctBnbLeadComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctBnbLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
