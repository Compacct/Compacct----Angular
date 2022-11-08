import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JOHRealisticExpectationFormComponent } from './joh-realistic-expectation-form.component';

describe('JOHRealisticExpectationFormComponent', () => {
  let component: JOHRealisticExpectationFormComponent;
  let fixture: ComponentFixture<JOHRealisticExpectationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JOHRealisticExpectationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JOHRealisticExpectationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
