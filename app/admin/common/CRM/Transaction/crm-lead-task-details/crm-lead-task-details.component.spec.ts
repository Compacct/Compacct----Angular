import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmLeadTaskDetailsComponent } from './crm-lead-task-details.component';

describe('CrmLeadTaskDetailsComponent', () => {
  let component: CrmLeadTaskDetailsComponent;
  let fixture: ComponentFixture<CrmLeadTaskDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmLeadTaskDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmLeadTaskDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
