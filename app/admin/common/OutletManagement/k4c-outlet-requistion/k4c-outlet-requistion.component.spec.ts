import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cOutletRequistionComponent } from './k4c-outlet-requistion.component';

describe('K4cOutletRequistionComponent', () => {
  let component: K4cOutletRequistionComponent;
  let fixture: ComponentFixture<K4cOutletRequistionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cOutletRequistionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cOutletRequistionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
