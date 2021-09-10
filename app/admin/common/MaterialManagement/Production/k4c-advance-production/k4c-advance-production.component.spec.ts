import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cAdvanceProductionComponent } from './k4c-advance-production.component';

describe('K4cAdvanceProductionComponent', () => {
  let component: K4cAdvanceProductionComponent;
  let fixture: ComponentFixture<K4cAdvanceProductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cAdvanceProductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cAdvanceProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
