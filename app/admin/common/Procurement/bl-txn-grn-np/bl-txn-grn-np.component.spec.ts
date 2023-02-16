import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BLTxnGrnNPComponent } from './bl-txn-grn-np.component';

describe('BLTxnGrnNPComponent', () => {
  let component: BLTxnGrnNPComponent;
  let fixture: ComponentFixture<BLTxnGrnNPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BLTxnGrnNPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BLTxnGrnNPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
