import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailBrowseAdvanceComponent } from './retail-browse-advance.component';

describe('RetailBrowseAdvanceComponent', () => {
  let component: RetailBrowseAdvanceComponent;
  let fixture: ComponentFixture<RetailBrowseAdvanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailBrowseAdvanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailBrowseAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
