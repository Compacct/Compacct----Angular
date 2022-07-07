import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { REPStockReportComponent } from './rep-stock-report.component';

describe('REPStockReportComponent', () => {
  let component: REPStockReportComponent;
  let fixture: ComponentFixture<REPStockReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ REPStockReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(REPStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
