import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cOutletStockReportComponent } from './k4c-outlet-stock-report.component';

describe('K4cOutletStockReportComponent', () => {
  let component: K4cOutletStockReportComponent;
  let fixture: ComponentFixture<K4cOutletStockReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cOutletStockReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cOutletStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
