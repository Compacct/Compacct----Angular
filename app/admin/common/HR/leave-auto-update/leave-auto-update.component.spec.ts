import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveAutoUpdateComponent } from './leave-auto-update.component';

describe('LeaveAutoUpdateComponent', () => {
  let component: LeaveAutoUpdateComponent;
  let fixture: ComponentFixture<LeaveAutoUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveAutoUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveAutoUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
