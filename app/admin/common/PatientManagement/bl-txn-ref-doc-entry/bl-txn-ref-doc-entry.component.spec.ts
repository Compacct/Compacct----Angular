import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlTxnRefDocEntryComponent } from './bl-txn-ref-doc-entry.component';

describe('BlTxnRefDocEntryComponent', () => {
  let component: BlTxnRefDocEntryComponent;
  let fixture: ComponentFixture<BlTxnRefDocEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlTxnRefDocEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlTxnRefDocEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
