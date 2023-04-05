import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NepalSupTktSalesReturnApproveComponent } from './nepal-sup-tkt-sales-return-approve.component';

describe('NepalSupTktSalesReturnApproveComponent', () => {
  let component: NepalSupTktSalesReturnApproveComponent;
  let fixture: ComponentFixture<NepalSupTktSalesReturnApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NepalSupTktSalesReturnApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NepalSupTktSalesReturnApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
