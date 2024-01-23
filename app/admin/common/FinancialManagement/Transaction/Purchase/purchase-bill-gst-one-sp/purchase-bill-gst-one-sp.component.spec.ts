import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseBillGSTOneSPComponent } from './purchase-bill-gst-one-sp.component';

describe('PurchaseBillGSTOneSPComponent', () => {
  let component: PurchaseBillGSTOneSPComponent;
  let fixture: ComponentFixture<PurchaseBillGSTOneSPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseBillGSTOneSPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseBillGSTOneSPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
