import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillNoChangeComponent } from './bill-no-change.component';

describe('BillNoChangeComponent', () => {
  let component: BillNoChangeComponent;
  let fixture: ComponentFixture<BillNoChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillNoChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillNoChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
