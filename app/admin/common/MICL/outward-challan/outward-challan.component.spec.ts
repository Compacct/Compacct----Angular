import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutwardChallanComponent } from './outward-challan.component';

describe('OutwardChallanComponent', () => {
  let component: OutwardChallanComponent;
  let fixture: ComponentFixture<OutwardChallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutwardChallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutwardChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
