import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompacctProductDetailsComponent } from './compacct-product-details.component';

describe('CompacctProductDetailsComponent', () => {
  let component: CompacctProductDetailsComponent;
  let fixture: ComponentFixture<CompacctProductDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompacctProductDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
