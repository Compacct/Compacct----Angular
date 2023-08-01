import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cDiagnosisPosBillComponent } from './k4c-diagnosis-pos-bill.component';

describe('K4cDiagnosisPosBillComponent', () => {
  let component: K4cDiagnosisPosBillComponent;
  let fixture: ComponentFixture<K4cDiagnosisPosBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cDiagnosisPosBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cDiagnosisPosBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
