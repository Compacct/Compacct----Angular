import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostcenterTargetJohComponent } from './costcenter-target-joh.component';

describe('CostcenterTargetJohComponent', () => {
  let component: CostcenterTargetJohComponent;
  let fixture: ComponentFixture<CostcenterTargetJohComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostcenterTargetJohComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostcenterTargetJohComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
