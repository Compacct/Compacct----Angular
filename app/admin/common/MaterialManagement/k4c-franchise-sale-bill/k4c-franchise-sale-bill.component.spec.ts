import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cFranchiseSaleBillComponent } from './k4c-franchise-sale-bill.component';

describe('K4cFranchiseSaleBillComponent', () => {
  let component: K4cFranchiseSaleBillComponent;
  let fixture: ComponentFixture<K4cFranchiseSaleBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cFranchiseSaleBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cFranchiseSaleBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
