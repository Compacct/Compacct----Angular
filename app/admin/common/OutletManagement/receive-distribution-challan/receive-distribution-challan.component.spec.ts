import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveDistributionChallanComponent } from './receive-distribution-challan.component';

describe('ReceiveDistributionChallanComponent', () => {
  let component: ReceiveDistributionChallanComponent;
  let fixture: ComponentFixture<ReceiveDistributionChallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveDistributionChallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveDistributionChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
