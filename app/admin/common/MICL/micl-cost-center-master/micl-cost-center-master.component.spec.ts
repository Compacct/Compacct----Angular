import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MICLCostCenterMasterComponent } from './micl-cost-center-master.component';

describe('MICLCostCenterMasterComponent', () => {
  let component: MICLCostCenterMasterComponent;
  let fixture: ComponentFixture<MICLCostCenterMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MICLCostCenterMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MICLCostCenterMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
