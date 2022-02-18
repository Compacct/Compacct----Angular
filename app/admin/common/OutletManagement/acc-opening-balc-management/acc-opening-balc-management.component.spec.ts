import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccOpeningBalcManagementComponent } from './acc-opening-balc-management.component';

describe('AccOpeningBalcManagementComponent', () => {
  let component: AccOpeningBalcManagementComponent;
  let fixture: ComponentFixture<AccOpeningBalcManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccOpeningBalcManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccOpeningBalcManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
