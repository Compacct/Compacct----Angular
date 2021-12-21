import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderBudgetComponent } from './tender-budget.component';

describe('TenderBudgetComponent', () => {
  let component: TenderBudgetComponent;
  let fixture: ComponentFixture<TenderBudgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenderBudgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenderBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
