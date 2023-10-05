import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceSupportTicketComponent } from './service-support-ticket.component';

describe('ServiceSupportTicketComponent', () => {
  let component: ServiceSupportTicketComponent;
  let fixture: ComponentFixture<ServiceSupportTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceSupportTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceSupportTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
