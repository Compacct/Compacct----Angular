import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueStockAdjustmentComponent } from './issue-stock-adjustment.component';

describe('IssueStockAdjustmentComponent', () => {
  let component: IssueStockAdjustmentComponent;
  let fixture: ComponentFixture<IssueStockAdjustmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueStockAdjustmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueStockAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
