import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseBillFromGrnComponent } from './purchase-bill-from-grn.component';

describe('PurchaseBillFromGrnComponent', () => {
  let component: PurchaseBillFromGrnComponent;
  let fixture: ComponentFixture<PurchaseBillFromGrnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseBillFromGrnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseBillFromGrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
