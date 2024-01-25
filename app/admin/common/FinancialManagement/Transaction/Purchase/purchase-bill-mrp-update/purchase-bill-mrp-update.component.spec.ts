import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseBillMrpUpdateComponent } from './purchase-bill-mrp-update.component';

describe('PurchaseBillMrpUpdateComponent', () => {
  let component: PurchaseBillMrpUpdateComponent;
  let fixture: ComponentFixture<PurchaseBillMrpUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseBillMrpUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseBillMrpUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
