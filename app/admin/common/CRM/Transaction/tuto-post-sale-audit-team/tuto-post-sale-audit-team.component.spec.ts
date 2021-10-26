import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoPostSaleAuditTeamComponent } from './tuto-post-sale-audit-team.component';

describe('TutoPostSaleAuditTeamComponent', () => {
  let component: TutoPostSaleAuditTeamComponent;
  let fixture: ComponentFixture<TutoPostSaleAuditTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoPostSaleAuditTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoPostSaleAuditTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
