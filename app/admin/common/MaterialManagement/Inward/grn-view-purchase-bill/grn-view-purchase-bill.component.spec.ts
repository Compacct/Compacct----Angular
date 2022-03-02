import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnViewPurchaseBillComponent } from './grn-view-purchase-bill.component';

describe('GrnViewPurchaseBillComponent', () => {
  let component: GrnViewPurchaseBillComponent;
  let fixture: ComponentFixture<GrnViewPurchaseBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrnViewPurchaseBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrnViewPurchaseBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
