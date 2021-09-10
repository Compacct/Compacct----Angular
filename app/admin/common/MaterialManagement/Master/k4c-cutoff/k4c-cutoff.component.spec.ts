import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cCutoffComponent } from './k4c-cutoff.component';

describe('K4cCutoffComponent', () => {
  let component: K4cCutoffComponent;
  let fixture: ComponentFixture<K4cCutoffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cCutoffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cCutoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
