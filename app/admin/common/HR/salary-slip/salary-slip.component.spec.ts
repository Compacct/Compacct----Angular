import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarySlipComponent } from './salary-slip.component';

describe('SalarySlipComponent', () => {
  let component: SalarySlipComponent;
  let fixture: ComponentFixture<SalarySlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalarySlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalarySlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
