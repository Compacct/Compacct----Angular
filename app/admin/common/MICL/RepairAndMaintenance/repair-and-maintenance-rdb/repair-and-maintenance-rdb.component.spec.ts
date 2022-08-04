import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairAndMaintenanceRdbComponent } from './repair-and-maintenance-rdb.component';

describe('RepairAndMaintenanceRdbComponent', () => {
  let component: RepairAndMaintenanceRdbComponent;
  let fixture: ComponentFixture<RepairAndMaintenanceRdbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairAndMaintenanceRdbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairAndMaintenanceRdbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
