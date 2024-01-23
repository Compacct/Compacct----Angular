import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcApprovalComponent } from './qc-approval.component';

describe('QcApprovalComponent', () => {
  let component: QcApprovalComponent;
  let fixture: ComponentFixture<QcApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QcApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
