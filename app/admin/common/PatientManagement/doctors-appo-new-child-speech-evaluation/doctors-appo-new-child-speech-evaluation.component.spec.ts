import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsAppoNewChildSpeechEvaluationComponent } from './doctors-appo-new-child-speech-evaluation.component';

describe('DoctorsAppoNewChildSpeechEvaluationComponent', () => {
  let component: DoctorsAppoNewChildSpeechEvaluationComponent;
  let fixture: ComponentFixture<DoctorsAppoNewChildSpeechEvaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorsAppoNewChildSpeechEvaluationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorsAppoNewChildSpeechEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
