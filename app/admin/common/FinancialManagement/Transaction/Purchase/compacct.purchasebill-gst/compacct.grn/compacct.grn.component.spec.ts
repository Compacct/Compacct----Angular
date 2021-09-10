import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CompacctGrnComponent } from "./compacct.grn.component";

describe("CompacctGrnComponent", () => {
  let component: CompacctGrnComponent;
  let fixture: ComponentFixture<CompacctGrnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompacctGrnComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctGrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
