import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TxnEnqTenderHarbauerComponent } from './txn-enq-tender-harbauer.component';

describe('TxnEnqTenderHarbauerComponent', () => {
  let component: TxnEnqTenderHarbauerComponent;
  let fixture: ComponentFixture<TxnEnqTenderHarbauerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TxnEnqTenderHarbauerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TxnEnqTenderHarbauerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
