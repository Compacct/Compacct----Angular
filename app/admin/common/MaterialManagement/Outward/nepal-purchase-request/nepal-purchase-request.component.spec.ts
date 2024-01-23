import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NepalPurchaseRequestComponent } from './nepal-purchase-request.component';

describe('NepalPurchaseRequestComponent', () => {
  let component: NepalPurchaseRequestComponent;
  let fixture: ComponentFixture<NepalPurchaseRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NepalPurchaseRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NepalPurchaseRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
