import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportTicketPendingCallsNepalComponent } from './support-ticket-pending-calls-nepal.component';

describe('SupportTicketPendingCallsNepalComponent', () => {
  let component: SupportTicketPendingCallsNepalComponent;
  let fixture: ComponentFixture<SupportTicketPendingCallsNepalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportTicketPendingCallsNepalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportTicketPendingCallsNepalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
