import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompacctStockReportComponent } from './compacct-stock-report.component';

describe('CompacctStockReportComponent', () => {
  let component: CompacctStockReportComponent;
  let fixture: ComponentFixture<CompacctStockReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompacctStockReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
