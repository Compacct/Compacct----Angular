import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Compacct.FinancialDetailsComponent } from './compacct.financial-details.component';

describe('Compacct.FinancialDetailsComponent', () => {
  let component: Compacct.FinancialDetailsComponent;
  let fixture: ComponentFixture<Compacct.FinancialDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Compacct.FinancialDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Compacct.FinancialDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
