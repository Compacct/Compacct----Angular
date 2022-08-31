import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterHolidayComponent } from './master-holiday.component';

describe('MasterHolidayComponent', () => {
  let component: MasterHolidayComponent;
  let fixture: ComponentFixture<MasterHolidayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterHolidayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
