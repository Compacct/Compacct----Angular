import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cMasterCostCenterComponent } from './k4c-master-cost-center.component';

describe('K4cMasterCostCenterComponent', () => {
  let component: K4cMasterCostCenterComponent;
  let fixture: ComponentFixture<K4cMasterCostCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cMasterCostCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cMasterCostCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
