import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullAndFinalSettlementJohHrComponent } from './full-and-final-settlement-joh-hr.component';

describe('FullAndFinalSettlementJohHrComponent', () => {
  let component: FullAndFinalSettlementJohHrComponent;
  let fixture: ComponentFixture<FullAndFinalSettlementJohHrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullAndFinalSettlementJohHrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullAndFinalSettlementJohHrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
