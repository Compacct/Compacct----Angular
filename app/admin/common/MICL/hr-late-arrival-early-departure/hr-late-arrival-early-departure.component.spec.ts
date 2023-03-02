import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrLateArrivalEarlyDepartureComponent } from './hr-late-arrival-early-departure.component';

describe('HrLateArrivalEarlyDepartureComponent', () => {
  let component: HrLateArrivalEarlyDepartureComponent;
  let fixture: ComponentFixture<HrLateArrivalEarlyDepartureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrLateArrivalEarlyDepartureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrLateArrivalEarlyDepartureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
