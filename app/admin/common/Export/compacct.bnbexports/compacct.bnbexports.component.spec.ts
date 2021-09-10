import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CompacctBnbexportsComponent } from "./compacct.bnbexports.component";

describe("CompacctBnbexportsComponent", () => {
  let component: CompacctBnbexportsComponent;
  let fixture: ComponentFixture<CompacctBnbexportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompacctBnbexportsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctBnbexportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
