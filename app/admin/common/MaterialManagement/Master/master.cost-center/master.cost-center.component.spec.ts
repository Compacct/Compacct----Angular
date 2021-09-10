import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterCostCenterComponent } from './master.cost-center.component';

describe('MasterCostCenterComponent', () => {
  let component: MasterCostCenterComponent;
  let fixture: ComponentFixture<MasterCostCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterCostCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterCostCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
