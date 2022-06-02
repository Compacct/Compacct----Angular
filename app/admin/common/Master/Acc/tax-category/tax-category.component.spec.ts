import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxCategoryComponent } from './tax-category.component';

describe('TaxCategoryComponent', () => {
  let component: TaxCategoryComponent;
  let fixture: ComponentFixture<TaxCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
