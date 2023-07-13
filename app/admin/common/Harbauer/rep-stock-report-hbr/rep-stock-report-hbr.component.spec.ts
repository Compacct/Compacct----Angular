import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { REPStockReportHBRComponent } from './rep-stock-report-hbr.component';

describe('REPStockReportHBRComponent', () => {
  let component: REPStockReportHBRComponent;
  let fixture: ComponentFixture<REPStockReportHBRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ REPStockReportHBRComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(REPStockReportHBRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
