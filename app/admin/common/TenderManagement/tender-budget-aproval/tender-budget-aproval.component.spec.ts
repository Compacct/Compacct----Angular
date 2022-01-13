import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderBudgetAprovalComponent } from './tender-budget-aproval.component';

describe('TenderBudgetAprovalComponent', () => {
  let component: TenderBudgetAprovalComponent;
  let fixture: ComponentFixture<TenderBudgetAprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenderBudgetAprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenderBudgetAprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
