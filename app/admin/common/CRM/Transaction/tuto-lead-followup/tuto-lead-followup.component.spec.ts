import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoLeadFollowupComponent } from './tuto-lead-followup.component';

describe('TutoLeadFollowupComponent', () => {
  let component: TutoLeadFollowupComponent;
  let fixture: ComponentFixture<TutoLeadFollowupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoLeadFollowupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoLeadFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
