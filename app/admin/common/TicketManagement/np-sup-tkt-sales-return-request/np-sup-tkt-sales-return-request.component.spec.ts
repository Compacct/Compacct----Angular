import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NPSupTktSalesReturnRequestComponent } from './np-sup-tkt-sales-return-request.component';

describe('NPSupTktSalesReturnRequestComponent', () => {
  let component: NPSupTktSalesReturnRequestComponent;
  let fixture: ComponentFixture<NPSupTktSalesReturnRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NPSupTktSalesReturnRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NPSupTktSalesReturnRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
