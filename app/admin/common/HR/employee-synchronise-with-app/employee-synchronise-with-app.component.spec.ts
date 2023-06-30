import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSynchroniseWithAppComponent } from './employee-synchronise-with-app.component';

describe('EmployeeSynchroniseWithAppComponent', () => {
  let component: EmployeeSynchroniseWithAppComponent;
  let fixture: ComponentFixture<EmployeeSynchroniseWithAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeSynchroniseWithAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSynchroniseWithAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
