import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAdultSpeechEvaluationComponent } from './new-adult-speech-evaluation.component';

describe('NewAdultSpeechEvaluationComponent', () => {
  let component: NewAdultSpeechEvaluationComponent;
  let fixture: ComponentFixture<NewAdultSpeechEvaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAdultSpeechEvaluationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAdultSpeechEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
