import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoReceiveVoucherComponent } from './tuto-receive-voucher.component';

describe('TutoReceiveVoucherComponent', () => {
  let component: TutoReceiveVoucherComponent;
  let fixture: ComponentFixture<TutoReceiveVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoReceiveVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoReceiveVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
