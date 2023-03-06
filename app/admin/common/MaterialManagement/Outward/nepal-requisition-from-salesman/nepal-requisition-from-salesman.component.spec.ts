import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NepalRequisitionFromSalesmanComponent } from './nepal-requisition-from-salesman.component';

describe('NepalRequisitionFromSalesmanComponent', () => {
  let component: NepalRequisitionFromSalesmanComponent;
  let fixture: ComponentFixture<NepalRequisitionFromSalesmanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NepalRequisitionFromSalesmanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NepalRequisitionFromSalesmanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
