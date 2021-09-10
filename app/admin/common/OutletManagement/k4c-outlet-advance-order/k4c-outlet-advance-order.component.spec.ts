import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cOutletAdvanceOrderComponent } from './k4c-outlet-advance-order.component';

describe('K4cOutletAdvanceOrderComponent', () => {
  let component: K4cOutletAdvanceOrderComponent;
  let fixture: ComponentFixture<K4cOutletAdvanceOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cOutletAdvanceOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cOutletAdvanceOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
