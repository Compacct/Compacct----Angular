import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlCrmLsqBillManagementComponent } from './bl-crm-lsq-bill-management.component';

describe('BlCrmLsqBillManagementComponent', () => {
  let component: BlCrmLsqBillManagementComponent;
  let fixture: ComponentFixture<BlCrmLsqBillManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlCrmLsqBillManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlCrmLsqBillManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
