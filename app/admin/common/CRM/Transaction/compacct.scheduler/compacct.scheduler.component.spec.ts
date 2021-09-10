import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CompacctSchedulerComponent } from "./compacct.scheduler.component";

describe("CompacctSchedulerComponent", () => {
  let component: CompacctSchedulerComponent;
  let fixture: ComponentFixture<CompacctSchedulerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompacctSchedulerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
