import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonReturnableGatePassComponent } from './non-returnable-gate-pass.component';

describe('NonReturnableGatePassComponent', () => {
  let component: NonReturnableGatePassComponent;
  let fixture: ComponentFixture<NonReturnableGatePassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonReturnableGatePassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonReturnableGatePassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
