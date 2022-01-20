import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderSingleSchBudgetComponent } from './tender-single-sch-budget.component';

describe('TenderSingleSchBudgetComponent', () => {
  let component: TenderSingleSchBudgetComponent;
  let fixture: ComponentFixture<TenderSingleSchBudgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenderSingleSchBudgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenderSingleSchBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
