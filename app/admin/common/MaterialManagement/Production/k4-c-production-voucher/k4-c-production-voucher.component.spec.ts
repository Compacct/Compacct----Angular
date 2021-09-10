import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4CProductionVoucherComponent } from './k4-c-production-voucher.component';

describe('K4CProductionVoucherComponent', () => {
  let component: K4CProductionVoucherComponent;
  let fixture: ComponentFixture<K4CProductionVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4CProductionVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4CProductionVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
