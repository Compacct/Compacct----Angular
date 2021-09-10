import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cDayEndProcessComponent } from './k4c-day-end-process.component';

describe('K4cDayEndProcessComponent', () => {
  let component: K4cDayEndProcessComponent;
  let fixture: ComponentFixture<K4cDayEndProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cDayEndProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cDayEndProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
