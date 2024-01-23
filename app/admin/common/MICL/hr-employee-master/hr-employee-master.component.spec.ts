import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HREmployeeMasterComponent } from './hr-employee-master.component';

describe('HREmployeeMasterComponent', () => {
  let component: HREmployeeMasterComponent;
  let fixture: ComponentFixture<HREmployeeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HREmployeeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HREmployeeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
