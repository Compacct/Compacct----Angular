import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoMasterTeacherComponent } from './tuto-master-teacher.component';

describe('TutoMasterTeacherComponent', () => {
  let component: TutoMasterTeacherComponent;
  let fixture: ComponentFixture<TutoMasterTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoMasterTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoMasterTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
