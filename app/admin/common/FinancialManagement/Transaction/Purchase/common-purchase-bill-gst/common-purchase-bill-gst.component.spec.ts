import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonPurchaseBillGstComponent } from './common-purchase-bill-gst.component';

describe('CommonPurchaseBillGstComponent', () => {
  let component: CommonPurchaseBillGstComponent;
  let fixture: ComponentFixture<CommonPurchaseBillGstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonPurchaseBillGstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonPurchaseBillGstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
