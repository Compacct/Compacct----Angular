import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionAuthorizationComponent } from './requisition-authorization.component';

describe('RequisitionAuthorizationComponent', () => {
  let component: RequisitionAuthorizationComponent;
  let fixture: ComponentFixture<RequisitionAuthorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequisitionAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
