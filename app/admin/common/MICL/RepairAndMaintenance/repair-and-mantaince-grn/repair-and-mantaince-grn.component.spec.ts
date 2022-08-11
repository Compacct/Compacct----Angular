import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairAndMantainceGRNComponent } from './repair-and-mantaince-grn.component';

describe('RepairAndMantainceGRNComponent', () => {
  let component: RepairAndMantainceGRNComponent;
  let fixture: ComponentFixture<RepairAndMantainceGRNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairAndMantainceGRNComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairAndMantainceGRNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
