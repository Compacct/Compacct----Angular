import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HarbauerMasterProductMechanicalComponent } from './harbauer-master-product-mechanical.component';

describe('HarbauerMasterProductMechanicalComponent', () => {
  let component: HarbauerMasterProductMechanicalComponent;
  let fixture: ComponentFixture<HarbauerMasterProductMechanicalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HarbauerMasterProductMechanicalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarbauerMasterProductMechanicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
