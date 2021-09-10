import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkSmsNepalComponent } from './bulk-sms-nepal.component';

describe('BulkSmsNepalComponent', () => {
  let component: BulkSmsNepalComponent;
  let fixture: ComponentFixture<BulkSmsNepalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkSmsNepalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkSmsNepalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
