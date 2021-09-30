import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoCrmLeadFieldSaleComponent } from './tuto-crm-lead-field-sale.component';

describe('TutoCrmLeadFieldSaleComponent', () => {
  let component: TutoCrmLeadFieldSaleComponent;
  let fixture: ComponentFixture<TutoCrmLeadFieldSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoCrmLeadFieldSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoCrmLeadFieldSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
