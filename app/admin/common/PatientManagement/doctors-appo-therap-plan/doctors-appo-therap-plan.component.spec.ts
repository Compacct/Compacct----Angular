import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsAppoTherapPlanComponent } from './doctors-appo-therap-plan.component';

describe('DoctorsAppoTherapPlanComponent', () => {
  let component: DoctorsAppoTherapPlanComponent;
  let fixture: ComponentFixture<DoctorsAppoTherapPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorsAppoTherapPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorsAppoTherapPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
