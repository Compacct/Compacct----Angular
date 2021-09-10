import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cProductionVoucherNewComponent } from './k4c-production-voucher-new.component';

describe('K4cProductionVoucherNewComponent', () => {
  let component: K4cProductionVoucherNewComponent;
  let fixture: ComponentFixture<K4cProductionVoucherNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cProductionVoucherNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cProductionVoucherNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
