import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnableGatePassComponent } from './returnable-gate-pass.component';

describe('ReturnableGatePassComponent', () => {
  let component: ReturnableGatePassComponent;
  let fixture: ComponentFixture<ReturnableGatePassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnableGatePassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnableGatePassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
