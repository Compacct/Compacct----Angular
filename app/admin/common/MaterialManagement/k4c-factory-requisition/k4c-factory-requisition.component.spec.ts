import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cFactoryRequisitionComponent } from './k4c-factory-requisition.component';

describe('K4cFactoryRequisitionComponent', () => {
  let component: K4cFactoryRequisitionComponent;
  let fixture: ComponentFixture<K4cFactoryRequisitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cFactoryRequisitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cFactoryRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
