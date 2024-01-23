import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinsSubLedgerComponent } from './fins-sub-ledger.component';

describe('FinsSubLedgerComponent', () => {
  let component: FinsSubLedgerComponent;
  let fixture: ComponentFixture<FinsSubLedgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinsSubLedgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinsSubLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
