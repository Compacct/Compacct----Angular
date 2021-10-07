import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoAuditLeadFollowupComponent } from './tuto-audit-lead-followup.component';

describe('TutoAuditLeadFollowupComponent', () => {
  let component: TutoAuditLeadFollowupComponent;
  let fixture: ComponentFixture<TutoAuditLeadFollowupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoAuditLeadFollowupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoAuditLeadFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
