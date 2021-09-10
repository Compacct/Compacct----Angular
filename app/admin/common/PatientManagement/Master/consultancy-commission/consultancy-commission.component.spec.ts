import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultancyCommissionComponent } from './consultancy-commission.component';

describe('ConsultancyCommissionComponent', () => {
  let component: ConsultancyCommissionComponent;
  let fixture: ComponentFixture<ConsultancyCommissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultancyCommissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultancyCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
