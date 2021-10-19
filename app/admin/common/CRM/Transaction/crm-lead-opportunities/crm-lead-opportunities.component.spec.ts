import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmLeadOpportunitiesComponent } from './crm-lead-opportunities.component';

describe('CrmLeadOpportunitiesComponent', () => {
  let component: CrmLeadOpportunitiesComponent;
  let fixture: ComponentFixture<CrmLeadOpportunitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmLeadOpportunitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmLeadOpportunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
