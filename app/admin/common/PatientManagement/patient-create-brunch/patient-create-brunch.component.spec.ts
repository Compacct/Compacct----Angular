import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCreateBrunchComponent } from './patient-create-brunch.component';

describe('PatientCreateBrunchComponent', () => {
  let component: PatientCreateBrunchComponent;
  let fixture: ComponentFixture<PatientCreateBrunchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientCreateBrunchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientCreateBrunchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
