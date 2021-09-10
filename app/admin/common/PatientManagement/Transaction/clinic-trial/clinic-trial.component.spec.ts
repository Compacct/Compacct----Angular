import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicTrialComponent } from './clinic-trial.component';

describe('ClinicTrialComponent', () => {
  let component: ClinicTrialComponent;
  let fixture: ComponentFixture<ClinicTrialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicTrialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicTrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
