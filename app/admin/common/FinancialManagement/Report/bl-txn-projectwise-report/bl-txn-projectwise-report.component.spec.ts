import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlTxnProjectwiseReportComponent } from './bl-txn-projectwise-report.component';

describe('BlTxnProjectwiseReportComponent', () => {
  let component: BlTxnProjectwiseReportComponent;
  let fixture: ComponentFixture<BlTxnProjectwiseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlTxnProjectwiseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlTxnProjectwiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
