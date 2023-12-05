import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCreateWithInformationComponent } from './patient-create-with-information.component';

describe('PatientCreateWithInformationComponent', () => {
  let component: PatientCreateWithInformationComponent;
  let fixture: ComponentFixture<PatientCreateWithInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientCreateWithInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientCreateWithInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
