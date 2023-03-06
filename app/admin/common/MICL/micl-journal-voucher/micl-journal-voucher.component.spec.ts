import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MICLJournalVoucherComponent } from './micl-journal-voucher.component';

describe('MICLJournalVoucherComponent', () => {
  let component: MICLJournalVoucherComponent;
  let fixture: ComponentFixture<MICLJournalVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MICLJournalVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MICLJournalVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
