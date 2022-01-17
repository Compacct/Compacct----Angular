import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportTicketNepalComponent } from './support-ticket-nepal.component';

describe('SupportTicketNepalComponent', () => {
  let component: SupportTicketNepalComponent;
  let fixture: ComponentFixture<SupportTicketNepalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportTicketNepalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportTicketNepalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
