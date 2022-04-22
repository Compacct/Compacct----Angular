import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cProductCategoryUpdateComponent } from './k4c-product-category-update.component';

describe('K4cProductCategoryUpdateComponent', () => {
  let component: K4cProductCategoryUpdateComponent;
  let fixture: ComponentFixture<K4cProductCategoryUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cProductCategoryUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cProductCategoryUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
