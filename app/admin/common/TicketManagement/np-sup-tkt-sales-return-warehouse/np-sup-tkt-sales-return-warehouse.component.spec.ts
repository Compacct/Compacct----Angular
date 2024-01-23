import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NPSupTktSalesReturnWarehouseComponent } from './np-sup-tkt-sales-return-warehouse.component';

describe('NPSupTktSalesReturnWarehouseComponent', () => {
  let component: NPSupTktSalesReturnWarehouseComponent;
  let fixture: ComponentFixture<NPSupTktSalesReturnWarehouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NPSupTktSalesReturnWarehouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NPSupTktSalesReturnWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
