import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HearingCRMLeadFollowupComponent } from './hearing-crm-lead-followup.component';

describe('HearingCRMLeadFollowupComponent', () => {
  let component: HearingCRMLeadFollowupComponent;
  let fixture: ComponentFixture<HearingCRMLeadFollowupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HearingCRMLeadFollowupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HearingCRMLeadFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
