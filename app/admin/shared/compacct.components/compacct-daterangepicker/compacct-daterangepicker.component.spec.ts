import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompacctDaterangepickerComponent } from './compacct-daterangepicker.component';

describe('CompacctDaterangepickerComponent', () => {
  let component: CompacctDaterangepickerComponent;
  let fixture: ComponentFixture<CompacctDaterangepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompacctDaterangepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctDaterangepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
