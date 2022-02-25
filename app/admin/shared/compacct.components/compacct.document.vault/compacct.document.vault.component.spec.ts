import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Compacct.Document.VaultComponent } from './compacct.document.vault.component';

describe('Compacct.Document.VaultComponent', () => {
  let component: Compacct.Document.VaultComponent;
  let fixture: ComponentFixture<Compacct.Document.VaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Compacct.Document.VaultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Compacct.Document.VaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
