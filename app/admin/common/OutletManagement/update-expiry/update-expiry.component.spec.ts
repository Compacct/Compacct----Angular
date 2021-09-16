import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateExpiryComponent } from './update-expiry.component';

describe('UpdateExpiryComponent', () => {
  let component: UpdateExpiryComponent;
  let fixture: ComponentFixture<UpdateExpiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateExpiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateExpiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
