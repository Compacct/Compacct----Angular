import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceEngineeringTeamComponent } from './service-engineering-team.component';

describe('ServiceEngineeringTeamComponent', () => {
  let component: ServiceEngineeringTeamComponent;
  let fixture: ComponentFixture<ServiceEngineeringTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceEngineeringTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceEngineeringTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
