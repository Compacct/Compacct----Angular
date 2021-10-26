import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoPreSaleAuditTeamComponent } from './tuto-pre-sale-audit-team.component';

describe('TutoPreSaleAuditTeamComponent', () => {
  let component: TutoPreSaleAuditTeamComponent;
  let fixture: ComponentFixture<TutoPreSaleAuditTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoPreSaleAuditTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoPreSaleAuditTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
