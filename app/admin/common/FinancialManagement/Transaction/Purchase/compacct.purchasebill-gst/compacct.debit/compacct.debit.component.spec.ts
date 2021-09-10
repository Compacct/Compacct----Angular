import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CompacctDebitComponent } from "./compacct.debit.component";

describe("CompacctDebitComponent", () => {
  let component: CompacctDebitComponent;
  let fixture: ComponentFixture<CompacctDebitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompacctDebitComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctDebitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
