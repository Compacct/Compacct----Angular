import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoSchoolRequestDetailsComponent } from './tuto-school-request-details.component';

describe('TutoSchoolRequestDetailsComponent', () => {
  let component: TutoSchoolRequestDetailsComponent;
  let fixture: ComponentFixture<TutoSchoolRequestDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoSchoolRequestDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoSchoolRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
