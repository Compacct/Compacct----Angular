import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsAppoNewAdultSpeechEvaluationComponent } from './doctors-appo-new-adult-speech-evaluation.component';

describe('DoctorsAppoNewAdultSpeechEvaluationComponent', () => {
  let component: DoctorsAppoNewAdultSpeechEvaluationComponent;
  let fixture: ComponentFixture<DoctorsAppoNewAdultSpeechEvaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorsAppoNewAdultSpeechEvaluationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorsAppoNewAdultSpeechEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
