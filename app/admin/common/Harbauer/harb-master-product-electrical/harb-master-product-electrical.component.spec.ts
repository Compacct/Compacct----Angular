import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HarbMasterProductElectricalComponent } from './harb-master-product-electrical.component';

describe('HarbMasterProductElectricalComponent', () => {
  let component: HarbMasterProductElectricalComponent;
  let fixture: ComponentFixture<HarbMasterProductElectricalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HarbMasterProductElectricalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarbMasterProductElectricalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
