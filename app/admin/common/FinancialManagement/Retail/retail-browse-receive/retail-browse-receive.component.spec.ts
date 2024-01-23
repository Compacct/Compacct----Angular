import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailBrowseReceiveComponent } from './retail-browse-receive.component';

describe('RetailBrowseReceiveComponent', () => {
  let component: RetailBrowseReceiveComponent;
  let fixture: ComponentFixture<RetailBrowseReceiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailBrowseReceiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailBrowseReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
