import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterProductGeneralConsumablesComponent } from './master-product-general-consumables.component';

describe('MasterProductGeneralConsumablesComponent', () => {
  let component: MasterProductGeneralConsumablesComponent;
  let fixture: ComponentFixture<MasterProductGeneralConsumablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterProductGeneralConsumablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterProductGeneralConsumablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
