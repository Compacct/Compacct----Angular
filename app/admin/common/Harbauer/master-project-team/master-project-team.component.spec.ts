import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterProjectTeamComponent } from './master-project-team.component';

describe('MasterProjectTeamComponent', () => {
  let component: MasterProjectTeamComponent;
  let fixture: ComponentFixture<MasterProjectTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterProjectTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterProjectTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
