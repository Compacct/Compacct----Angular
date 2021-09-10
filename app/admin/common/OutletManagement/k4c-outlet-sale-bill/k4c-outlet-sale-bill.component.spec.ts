import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cOutletSaleBillComponent } from './k4c-outlet-sale-bill.component';

describe('K4cOutletSaleBillComponent', () => {
  let component: K4cOutletSaleBillComponent;
  let fixture: ComponentFixture<K4cOutletSaleBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cOutletSaleBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cOutletSaleBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
