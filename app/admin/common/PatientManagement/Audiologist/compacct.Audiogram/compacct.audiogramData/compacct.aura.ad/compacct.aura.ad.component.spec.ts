import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CompacctAuraAdComponent } from "./compacct.aura.ad.component";

describe("CompacctAuraAdComponent", () => {
  let component: CompacctAuraAdComponent;
  let fixture: ComponentFixture<CompacctAuraAdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompacctAuraAdComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctAuraAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
