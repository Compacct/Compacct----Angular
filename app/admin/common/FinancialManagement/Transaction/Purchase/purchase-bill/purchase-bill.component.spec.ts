import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseBillComponent } from './purchase-bill.component';

describe('PurchaseBillComponent', () => {
  let component: PurchaseBillComponent;
  let fixture: ComponentFixture<PurchaseBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
