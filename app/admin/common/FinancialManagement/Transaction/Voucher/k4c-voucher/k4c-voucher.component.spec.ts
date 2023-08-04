import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cVoucherComponent } from './k4c-voucher.component';

describe('K4cVoucherComponent', () => {
  let component: K4cVoucherComponent;
  let fixture: ComponentFixture<K4cVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
