import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRegisterComponent } from './leave-register.component';

describe('LeaveRegisterComponent', () => {
  let component: LeaveRegisterComponent;
  let fixture: ComponentFixture<LeaveRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
