import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppraisalFormComponent } from './appraisal-form.component';

describe('AppraisalFormComponent', () => {
  let component: AppraisalFormComponent;
  let fixture: ComponentFixture<AppraisalFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppraisalFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppraisalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
