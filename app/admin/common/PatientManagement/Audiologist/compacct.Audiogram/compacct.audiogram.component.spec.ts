import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CompacctAudiogramComponent } from "./compacct.audiogram.component";

describe("CompacctAudiogramComponent", () => {
  let component: CompacctAudiogramComponent;
  let fixture: ComponentFixture<CompacctAudiogramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompacctAudiogramComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctAudiogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
