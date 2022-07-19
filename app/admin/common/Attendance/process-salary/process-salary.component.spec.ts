import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessSalaryComponent } from './process-salary.component';

describe('ProcessSalaryComponent', () => {
  let component: ProcessSalaryComponent;
  let fixture: ComponentFixture<ProcessSalaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessSalaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
