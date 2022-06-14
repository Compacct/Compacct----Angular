import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cConversionOfProductComponent } from './k4c-conversion-of-product.component';

describe('K4cConversionOfProductComponent', () => {
  let component: K4cConversionOfProductComponent;
  let fixture: ComponentFixture<K4cConversionOfProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cConversionOfProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cConversionOfProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
