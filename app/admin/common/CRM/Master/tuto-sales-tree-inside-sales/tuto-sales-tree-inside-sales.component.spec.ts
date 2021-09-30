import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoSalesTreeInsideSalesComponent } from './tuto-sales-tree-inside-sales.component';

describe('TutoSalesTreeInsideSalesComponent', () => {
  let component: TutoSalesTreeInsideSalesComponent;
  let fixture: ComponentFixture<TutoSalesTreeInsideSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoSalesTreeInsideSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoSalesTreeInsideSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
