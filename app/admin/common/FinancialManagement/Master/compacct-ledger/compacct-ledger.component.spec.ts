import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompacctLedgerComponent } from './compacct-ledger.component';

describe('CompacctLedgerComponent', () => {
  let component: CompacctLedgerComponent;
  let fixture: ComponentFixture<CompacctLedgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompacctLedgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
