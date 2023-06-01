import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BLTxnProductReturnFromProjectComponent } from './bl-txn-product-return-from-project.component';

describe('BLTxnProductReturnFromProjectComponent', () => {
  let component: BLTxnProductReturnFromProjectComponent;
  let fixture: ComponentFixture<BLTxnProductReturnFromProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BLTxnProductReturnFromProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BLTxnProductReturnFromProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
