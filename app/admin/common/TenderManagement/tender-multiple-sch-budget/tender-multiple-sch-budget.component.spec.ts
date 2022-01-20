import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderMultipleSchBudgetComponent } from './tender-multiple-sch-budget.component';

describe('TenderMultipleSchBudgetComponent', () => {
  let component: TenderMultipleSchBudgetComponent;
  let fixture: ComponentFixture<TenderMultipleSchBudgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenderMultipleSchBudgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenderMultipleSchBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
