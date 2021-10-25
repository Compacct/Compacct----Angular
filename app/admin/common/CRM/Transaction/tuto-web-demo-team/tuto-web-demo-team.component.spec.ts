import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoWebDemoTeamComponent } from './tuto-web-demo-team.component';

describe('TutoWebDemoTeamComponent', () => {
  let component: TutoWebDemoTeamComponent;
  let fixture: ComponentFixture<TutoWebDemoTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoWebDemoTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoWebDemoTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
