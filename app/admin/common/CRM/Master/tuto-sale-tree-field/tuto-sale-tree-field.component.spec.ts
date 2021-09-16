import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoSaleTreeFieldComponent } from './tuto-sale-tree-field.component';

describe('TutoSaleTreeFieldComponent', () => {
  let component: TutoSaleTreeFieldComponent;
  let fixture: ComponentFixture<TutoSaleTreeFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoSaleTreeFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoSaleTreeFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
