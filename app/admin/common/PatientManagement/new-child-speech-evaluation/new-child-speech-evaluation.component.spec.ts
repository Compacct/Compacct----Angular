import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewChildSpeechEvaluationComponent } from './new-child-speech-evaluation.component';

describe('NewChildSpeechEvaluationComponent', () => {
  let component: NewChildSpeechEvaluationComponent;
  let fixture: ComponentFixture<NewChildSpeechEvaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewChildSpeechEvaluationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewChildSpeechEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
