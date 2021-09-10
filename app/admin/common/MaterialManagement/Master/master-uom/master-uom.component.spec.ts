import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterUomComponent } from './master-uom.component';

describe('MasterUomComponent', () => {
  let component: MasterUomComponent;
  let fixture: ComponentFixture<MasterUomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterUomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterUomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
