import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cPurchasePlaningComponent } from './k4c-purchase-planing.component';

describe('K4cPurchasePlaningComponent', () => {
  let component: K4cPurchasePlaningComponent;
  let fixture: ComponentFixture<K4cPurchasePlaningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cPurchasePlaningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cPurchasePlaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
