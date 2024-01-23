import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4CStockDetailsComponent } from './k4-c-stock-details.component';

describe('K4CStockDetailsComponent', () => {
  let component: K4CStockDetailsComponent;
  let fixture: ComponentFixture<K4CStockDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4CStockDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4CStockDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
