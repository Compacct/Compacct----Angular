import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4CDispatchOutletAdvOrderComponent } from './k4-c-dispatch-outlet-adv-order.component';

describe('K4CDispatchOutletAdvOrderComponent', () => {
  let component: K4CDispatchOutletAdvOrderComponent;
  let fixture: ComponentFixture<K4CDispatchOutletAdvOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4CDispatchOutletAdvOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4CDispatchOutletAdvOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
