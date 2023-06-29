import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailAdvanceOrderComponent } from './retail-advance-order.component';

describe('RetailAdvanceOrderComponent', () => {
  let component: RetailAdvanceOrderComponent;
  let fixture: ComponentFixture<RetailAdvanceOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailAdvanceOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailAdvanceOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
