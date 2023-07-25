import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceOrderAdjustmentComponent } from './advance-order-adjustment.component';

describe('AdvanceOrderAdjustmentComponent', () => {
  let component: AdvanceOrderAdjustmentComponent;
  let fixture: ComponentFixture<AdvanceOrderAdjustmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceOrderAdjustmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceOrderAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
