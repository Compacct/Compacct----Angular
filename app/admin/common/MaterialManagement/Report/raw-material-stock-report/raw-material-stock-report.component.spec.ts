import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialStockReportComponent } from './raw-material-stock-report.component';

describe('RawMaterialStockReportComponent', () => {
  let component: RawMaterialStockReportComponent;
  let fixture: ComponentFixture<RawMaterialStockReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RawMaterialStockReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RawMaterialStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
