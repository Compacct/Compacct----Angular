import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MICLDispatchChallanChargeableComponent } from './micl-dispatch-challan-chargeable.component';

describe('MICLDispatchChallanChargeableComponent', () => {
  let component: MICLDispatchChallanChargeableComponent;
  let fixture: ComponentFixture<MICLDispatchChallanChargeableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MICLDispatchChallanChargeableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MICLDispatchChallanChargeableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
