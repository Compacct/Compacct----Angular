import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoSupportUserManagementComponent } from './tuto-support-user-management.component';

describe('TutoSupportUserManagementComponent', () => {
  let component: TutoSupportUserManagementComponent;
  let fixture: ComponentFixture<TutoSupportUserManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoSupportUserManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoSupportUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
