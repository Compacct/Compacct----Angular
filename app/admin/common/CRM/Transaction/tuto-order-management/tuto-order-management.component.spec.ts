import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoOrderManagementComponent } from './tuto-order-management.component';

describe('TutoOrderManagementComponent', () => {
  let component: TutoOrderManagementComponent;
  let fixture: ComponentFixture<TutoOrderManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoOrderManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoOrderManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
