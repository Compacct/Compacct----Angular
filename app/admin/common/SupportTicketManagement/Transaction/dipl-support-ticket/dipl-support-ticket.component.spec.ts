import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiplSupportTicketComponent } from './dipl-support-ticket.component';

describe('DiplSupportTicketComponent', () => {
  let component: DiplSupportTicketComponent;
  let fixture: ComponentFixture<DiplSupportTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiplSupportTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiplSupportTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
