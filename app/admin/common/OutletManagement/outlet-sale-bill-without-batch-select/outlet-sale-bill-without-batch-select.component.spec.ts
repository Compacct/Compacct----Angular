import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletSaleBillWithoutBatchSelectComponent } from './outlet-sale-bill-without-batch-select.component';

describe('OutletSaleBillWithoutBatchSelectComponent', () => {
  let component: OutletSaleBillWithoutBatchSelectComponent;
  let fixture: ComponentFixture<OutletSaleBillWithoutBatchSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutletSaleBillWithoutBatchSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletSaleBillWithoutBatchSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
