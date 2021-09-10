import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cDistributionChallanStatusComponent } from './k4c-distribution-challan-status.component';

describe('K4cDistributionChallanStatusComponent', () => {
  let component: K4cDistributionChallanStatusComponent;
  let fixture: ComponentFixture<K4cDistributionChallanStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cDistributionChallanStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cDistributionChallanStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
