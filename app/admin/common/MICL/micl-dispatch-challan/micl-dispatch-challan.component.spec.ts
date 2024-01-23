import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiclDispatchChallanComponent } from './micl-dispatch-challan.component';

describe('MiclDispatchChallanComponent', () => {
  let component: MiclDispatchChallanComponent;
  let fixture: ComponentFixture<MiclDispatchChallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiclDispatchChallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiclDispatchChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
