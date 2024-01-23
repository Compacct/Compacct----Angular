import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrLeaveOpeningComponent } from './hr-leave-opening.component';

describe('HrLeaveOpeningComponent', () => {
  let component: HrLeaveOpeningComponent;
  let fixture: ComponentFixture<HrLeaveOpeningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrLeaveOpeningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrLeaveOpeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
