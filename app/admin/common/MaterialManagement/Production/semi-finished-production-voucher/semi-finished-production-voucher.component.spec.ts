import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SemiFinishedProductionVoucherComponent } from './semi-finished-production-voucher.component';

describe('SemiFinishedProductionVoucherComponent', () => {
  let component: SemiFinishedProductionVoucherComponent;
  let fixture: ComponentFixture<SemiFinishedProductionVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SemiFinishedProductionVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SemiFinishedProductionVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
