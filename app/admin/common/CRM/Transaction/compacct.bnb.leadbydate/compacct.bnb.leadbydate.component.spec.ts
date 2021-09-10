import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CompacctBnbLeadbydateComponent } from "./compacct.bnb.leadbydate.component";

describe("CompacctBnbLeadbydateComponent", () => {
  let component: CompacctBnbLeadbydateComponent;
  let fixture: ComponentFixture<CompacctBnbLeadbydateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompacctBnbLeadbydateComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctBnbLeadbydateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
