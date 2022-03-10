import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompacctTxnTaskGanttComponent } from './compacct-txn-task-gantt.component';

describe('CompacctTxnTaskGanttComponent', () => {
  let component: CompacctTxnTaskGanttComponent;
  let fixture: ComponentFixture<CompacctTxnTaskGanttComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompacctTxnTaskGanttComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctTxnTaskGanttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
