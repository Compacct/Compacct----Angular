import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoPostSaleAuditLeadFollowupComponent } from './tuto-post-sale-audit-lead-followup.component';

describe('TutoPostSaleAuditLeadFollowupComponent', () => {
  let component: TutoPostSaleAuditLeadFollowupComponent;
  let fixture: ComponentFixture<TutoPostSaleAuditLeadFollowupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoPostSaleAuditLeadFollowupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoPostSaleAuditLeadFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
