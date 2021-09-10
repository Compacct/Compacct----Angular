import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CompacctCcshahaAdComponent } from "./compacct.ccshaha.ad.component";

describe("CompacctCcshahaAdComponent", () => {
  let component: CompacctCcshahaAdComponent;
  let fixture: ComponentFixture<CompacctCcshahaAdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompacctCcshahaAdComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctCcshahaAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
