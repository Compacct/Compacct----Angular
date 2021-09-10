import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cDispatchOutletStoreComponent } from './k4c-dispatch-outlet-store.component';

describe('K4cDispatchOutletStoreComponent', () => {
  let component: K4cDispatchOutletStoreComponent;
  let fixture: ComponentFixture<K4cDispatchOutletStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cDispatchOutletStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cDispatchOutletStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
