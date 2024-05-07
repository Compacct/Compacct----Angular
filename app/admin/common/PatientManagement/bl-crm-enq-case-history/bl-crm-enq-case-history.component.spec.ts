import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlCrmEnqCaseHistoryComponent } from './bl-crm-enq-case-history.component';

describe('BlCrmEnqCaseHistoryComponent', () => {
  let component: BlCrmEnqCaseHistoryComponent;
  let fixture: ComponentFixture<BlCrmEnqCaseHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlCrmEnqCaseHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlCrmEnqCaseHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
