import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HarbMasterProductCivilComponent } from './harb-master-product-civil.component';

describe('HarbMasterProductCivilComponent', () => {
  let component: HarbMasterProductCivilComponent;
  let fixture: ComponentFixture<HarbMasterProductCivilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HarbMasterProductCivilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarbMasterProductCivilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
