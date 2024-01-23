import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubledgerForAccountsComponent } from './subledger-for-accounts.component';

describe('SubledgerForAccountsComponent', () => {
  let component: SubledgerForAccountsComponent;
  let fixture: ComponentFixture<SubledgerForAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubledgerForAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubledgerForAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
