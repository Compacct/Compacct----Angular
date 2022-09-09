import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterConsultancyV3Component } from './master-consultancy-v3.component';

describe('MasterConsultancyV3Component', () => {
  let component: MasterConsultancyV3Component;
  let fixture: ComponentFixture<MasterConsultancyV3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterConsultancyV3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterConsultancyV3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
