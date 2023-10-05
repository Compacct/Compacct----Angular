import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cAllDiagnosisComponent } from './k4c-all-diagnosis.component';

describe('K4cAllDiagnosisComponent', () => {
  let component: K4cAllDiagnosisComponent;
  let fixture: ComponentFixture<K4cAllDiagnosisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cAllDiagnosisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cAllDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
