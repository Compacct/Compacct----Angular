import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsPlaningComponent } from './products-planing.component';

describe('ProductsPlaningComponent', () => {
  let component: ProductsPlaningComponent;
  let fixture: ComponentFixture<ProductsPlaningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsPlaningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsPlaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
