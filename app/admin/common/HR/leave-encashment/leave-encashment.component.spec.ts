import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveEncashmentComponent } from './leave-encashment.component';

describe('LeaveEncashmentComponent', () => {
  let component: LeaveEncashmentComponent;
  let fixture: ComponentFixture<LeaveEncashmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveEncashmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveEncashmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
