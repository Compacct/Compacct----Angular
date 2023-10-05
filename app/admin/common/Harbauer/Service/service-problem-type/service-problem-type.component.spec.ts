import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProblemTypeComponent } from './service-problem-type.component';

describe('ServiceProblemTypeComponent', () => {
  let component: ServiceProblemTypeComponent;
  let fixture: ComponentFixture<ServiceProblemTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceProblemTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceProblemTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
