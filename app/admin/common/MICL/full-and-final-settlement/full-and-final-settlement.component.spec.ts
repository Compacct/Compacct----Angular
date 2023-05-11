import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullAndFinalSettlementComponent } from './full-and-final-settlement.component';

describe('FullAndFinalSettlementComponent', () => {
  let component: FullAndFinalSettlementComponent;
  let fixture: ComponentFixture<FullAndFinalSettlementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullAndFinalSettlementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullAndFinalSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
