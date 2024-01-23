import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HarbTxnRequisitionComponent } from './harb-txn-requisition.component';

describe('HarbTxnRequisitionComponent', () => {
  let component: HarbTxnRequisitionComponent;
  let fixture: ComponentFixture<HarbTxnRequisitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HarbTxnRequisitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarbTxnRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
