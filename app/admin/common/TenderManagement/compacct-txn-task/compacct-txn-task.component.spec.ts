import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompacctTxnTaskComponent } from './compacct-txn-task.component';

describe('CompacctTxnTaskComponent', () => {
  let component: CompacctTxnTaskComponent;
  let fixture: ComponentFixture<CompacctTxnTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompacctTxnTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctTxnTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
