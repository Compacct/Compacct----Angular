import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cPosBillOrderComponent } from './k4c-pos-bill-order.component';

describe('K4cPosBillOrderComponent', () => {
  let component: K4cPosBillOrderComponent;
  let fixture: ComponentFixture<K4cPosBillOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cPosBillOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cPosBillOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
