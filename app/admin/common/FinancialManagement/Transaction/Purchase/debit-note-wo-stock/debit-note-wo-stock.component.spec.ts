import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitNoteWoStockComponent } from './debit-note-wo-stock.component';

describe('DebitNoteWoStockComponent', () => {
  let component: DebitNoteWoStockComponent;
  let fixture: ComponentFixture<DebitNoteWoStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebitNoteWoStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebitNoteWoStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
