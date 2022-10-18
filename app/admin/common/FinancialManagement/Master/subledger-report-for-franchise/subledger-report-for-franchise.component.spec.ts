import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubledgerReportForFranchiseComponent } from './subledger-report-for-franchise.component';

describe('SubledgerReportForFranchiseComponent', () => {
  let component: SubledgerReportForFranchiseComponent;
  let fixture: ComponentFixture<SubledgerReportForFranchiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubledgerReportForFranchiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubledgerReportForFranchiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
