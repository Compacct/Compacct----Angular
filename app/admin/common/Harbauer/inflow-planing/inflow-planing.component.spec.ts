import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InflowPlaningComponent } from './inflow-planing.component';

describe('InflowPlaningComponent', () => {
  let component: InflowPlaningComponent;
  let fixture: ComponentFixture<InflowPlaningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InflowPlaningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InflowPlaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
