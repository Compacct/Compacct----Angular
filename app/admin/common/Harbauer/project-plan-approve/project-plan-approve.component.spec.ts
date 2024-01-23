import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPlanApproveComponent } from './project-plan-approve.component';

describe('ProjectPlanApproveComponent', () => {
  let component: ProjectPlanApproveComponent;
  let fixture: ComponentFixture<ProjectPlanApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectPlanApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPlanApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
