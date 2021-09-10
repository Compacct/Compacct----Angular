import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorCommissionCalculatorComponent } from './doctor-commission-calculator.component';

describe('DoctorCommissionCalculatorComponent', () => {
  let component: DoctorCommissionCalculatorComponent;
  let fixture: ComponentFixture<DoctorCommissionCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorCommissionCalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorCommissionCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
