import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingGradeModuleComponent } from './training-grade-module.component';

describe('TrainingGradeModuleComponent', () => {
  let component: TrainingGradeModuleComponent;
  let fixture: ComponentFixture<TrainingGradeModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingGradeModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingGradeModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
