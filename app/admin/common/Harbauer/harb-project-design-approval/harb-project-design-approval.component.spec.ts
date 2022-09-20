import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HarbProjectDesignApprovalComponent } from './harb-project-design-approval.component';

describe('HarbProjectDesignApprovalComponent', () => {
  let component: HarbProjectDesignApprovalComponent;
  let fixture: ComponentFixture<HarbProjectDesignApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HarbProjectDesignApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarbProjectDesignApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
