import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueChallanComponent } from './issue-challan.component';

describe('IssueChallanComponent', () => {
  let component: IssueChallanComponent;
  let fixture: ComponentFixture<IssueChallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueChallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
