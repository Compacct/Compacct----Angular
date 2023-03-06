import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleBillComponent } from './sale-bill.component';

describe('SaleBillComponent', () => {
  let component: SaleBillComponent;
  let fixture: ComponentFixture<SaleBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
