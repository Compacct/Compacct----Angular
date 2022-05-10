import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailBrowseComponent } from './retail-browse.component';

describe('RetailBrowseComponent', () => {
  let component: RetailBrowseComponent;
  let fixture: ComponentFixture<RetailBrowseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailBrowseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
