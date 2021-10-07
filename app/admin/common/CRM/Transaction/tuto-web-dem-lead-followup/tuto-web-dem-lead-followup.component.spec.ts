import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoWebDemLeadFollowupComponent } from './tuto-web-dem-lead-followup.component';

describe('TutoWebDemLeadFollowupComponent', () => {
  let component: TutoWebDemLeadFollowupComponent;
  let fixture: ComponentFixture<TutoWebDemLeadFollowupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoWebDemLeadFollowupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoWebDemLeadFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
