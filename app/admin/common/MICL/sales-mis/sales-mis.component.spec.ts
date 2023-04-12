import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesMisComponent } from './sales-mis.component';

describe('SalesMisComponent', () => {
  let component: SalesMisComponent;
  let fixture: ComponentFixture<SalesMisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesMisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesMisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
