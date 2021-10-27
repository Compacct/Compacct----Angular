import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoFieldSalesSchoolComponent } from './tuto-field-sales-school.component';

describe('TutoFieldSalesSchoolComponent', () => {
  let component: TutoFieldSalesSchoolComponent;
  let fixture: ComponentFixture<TutoFieldSalesSchoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoFieldSalesSchoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoFieldSalesSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
