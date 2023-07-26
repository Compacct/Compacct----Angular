import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveEvaluateForTraningComponent } from './approve-evaluate-for-traning.component';

describe('ApproveEvaluateForTraningComponent', () => {
  let component: ApproveEvaluateForTraningComponent;
  let fixture: ComponentFixture<ApproveEvaluateForTraningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveEvaluateForTraningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveEvaluateForTraningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
