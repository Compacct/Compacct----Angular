import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HearingCaseHistoryComponent } from './hearing-case-history.component';

describe('HearingCaseHistoryComponent', () => {
  let component: HearingCaseHistoryComponent;
  let fixture: ComponentFixture<HearingCaseHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HearingCaseHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HearingCaseHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
