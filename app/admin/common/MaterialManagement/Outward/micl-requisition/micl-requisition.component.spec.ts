import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiclRequisitionComponent } from './micl-requisition.component';

describe('MiclRequisitionComponent', () => {
  let component: MiclRequisitionComponent;
  let fixture: ComponentFixture<MiclRequisitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiclRequisitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiclRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
