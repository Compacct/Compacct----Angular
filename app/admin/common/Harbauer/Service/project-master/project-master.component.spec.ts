import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMasterComponent } from './project-master.component';

describe('ProjectMasterComponent', () => {
  let component: ProjectMasterComponent;
  let fixture: ComponentFixture<ProjectMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
