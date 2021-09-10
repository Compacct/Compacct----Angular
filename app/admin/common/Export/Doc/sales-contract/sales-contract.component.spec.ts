import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesContractComponent } from './sales-contract.component';

describe('SalesContractComponent', () => {
  let component: SalesContractComponent;
  let fixture: ComponentFixture<SalesContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
