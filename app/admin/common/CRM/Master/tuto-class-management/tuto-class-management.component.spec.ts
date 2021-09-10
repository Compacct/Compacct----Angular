import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoClassManagementComponent } from './tuto-class-management.component';

describe('TutoClassManagementComponent', () => {
  let component: TutoClassManagementComponent;
  let fixture: ComponentFixture<TutoClassManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoClassManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoClassManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
