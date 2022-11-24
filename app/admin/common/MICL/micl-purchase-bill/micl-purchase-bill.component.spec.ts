import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiclPurchaseBillComponent } from './micl-purchase-bill.component';

describe('MiclPurchaseBillComponent', () => {
  let component: MiclPurchaseBillComponent;
  let fixture: ComponentFixture<MiclPurchaseBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiclPurchaseBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiclPurchaseBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
