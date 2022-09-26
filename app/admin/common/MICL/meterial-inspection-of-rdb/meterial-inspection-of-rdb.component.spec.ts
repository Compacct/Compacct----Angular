import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterialInspectionOfRDBComponent } from './meterial-inspection-of-rdb.component';

describe('MeterialInspectionOfRDBComponent', () => {
  let component: MeterialInspectionOfRDBComponent;
  let fixture: ComponentFixture<MeterialInspectionOfRDBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeterialInspectionOfRDBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterialInspectionOfRDBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
