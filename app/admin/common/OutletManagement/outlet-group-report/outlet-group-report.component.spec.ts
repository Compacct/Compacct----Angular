import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletGroupReportComponent } from './outlet-group-report.component';

describe('OutletGroupReportComponent', () => {
  let component: OutletGroupReportComponent;
  let fixture: ComponentFixture<OutletGroupReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutletGroupReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletGroupReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
