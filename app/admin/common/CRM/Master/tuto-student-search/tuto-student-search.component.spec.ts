import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoStudentSearchComponent } from './tuto-student-search.component';

describe('TutoStudentSearchComponent', () => {
  let component: TutoStudentSearchComponent;
  let fixture: ComponentFixture<TutoStudentSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoStudentSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoStudentSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
