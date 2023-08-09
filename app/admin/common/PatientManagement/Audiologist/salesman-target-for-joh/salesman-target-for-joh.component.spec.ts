import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmanTargetForJohComponent } from './salesman-target-for-joh.component';

describe('SalesmanTargetForJohComponent', () => {
  let component: SalesmanTargetForJohComponent;
  let fixture: ComponentFixture<SalesmanTargetForJohComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesmanTargetForJohComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesmanTargetForJohComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
