import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorSchedulComponent } from './doctor-schedul.component';

describe('DoctorSchedulComponent', () => {
  let component: DoctorSchedulComponent;
  let fixture: ComponentFixture<DoctorSchedulComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorSchedulComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorSchedulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
