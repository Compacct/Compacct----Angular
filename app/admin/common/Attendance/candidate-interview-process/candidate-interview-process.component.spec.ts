import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateInterviewProcessComponent } from './candidate-interview-process.component';

describe('CandidateInterviewProcessComponent', () => {
  let component: CandidateInterviewProcessComponent;
  let fixture: ComponentFixture<CandidateInterviewProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateInterviewProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateInterviewProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
