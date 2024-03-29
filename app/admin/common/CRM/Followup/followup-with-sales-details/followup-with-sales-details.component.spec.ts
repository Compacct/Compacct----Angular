import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowupWithSalesDetailsComponent } from './followup-with-sales-details.component';

describe('FollowupWithSalesDetailsComponent', () => {
  let component: FollowupWithSalesDetailsComponent;
  let fixture: ComponentFixture<FollowupWithSalesDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowupWithSalesDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowupWithSalesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
