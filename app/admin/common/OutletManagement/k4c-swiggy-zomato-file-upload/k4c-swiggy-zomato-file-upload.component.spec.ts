import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cSwiggyZomatoFileUploadComponent } from './k4c-swiggy-zomato-file-upload.component';

describe('K4cSwiggyZomatoFileUploadComponent', () => {
  let component: K4cSwiggyZomatoFileUploadComponent;
  let fixture: ComponentFixture<K4cSwiggyZomatoFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cSwiggyZomatoFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cSwiggyZomatoFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
