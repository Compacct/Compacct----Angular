import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialRequisitionComponent } from './raw-material-requisition.component';

describe('RawMaterialRequisitionComponent', () => {
  let component: RawMaterialRequisitionComponent;
  let fixture: ComponentFixture<RawMaterialRequisitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RawMaterialRequisitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RawMaterialRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
