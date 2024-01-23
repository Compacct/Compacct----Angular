import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockInterchangeComponent } from './stock-interchange.component';

describe('StockInterchangeComponent', () => {
  let component: StockInterchangeComponent;
  let fixture: ComponentFixture<StockInterchangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockInterchangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInterchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
