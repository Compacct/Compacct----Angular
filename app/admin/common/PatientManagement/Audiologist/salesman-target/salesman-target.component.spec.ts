import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmanTargetComponent } from './salesman-target.component';

describe('SalesmanTargetComponent', () => {
  let component: SalesmanTargetComponent;
  let fixture: ComponentFixture<SalesmanTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesmanTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesmanTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
