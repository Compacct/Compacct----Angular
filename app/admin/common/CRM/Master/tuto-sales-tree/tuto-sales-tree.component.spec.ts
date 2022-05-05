import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoSalesTreeComponent } from './tuto-sales-tree.component';

describe('TutoSalesTreeComponent', () => {
  let component: TutoSalesTreeComponent;
  let fixture: ComponentFixture<TutoSalesTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoSalesTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoSalesTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
