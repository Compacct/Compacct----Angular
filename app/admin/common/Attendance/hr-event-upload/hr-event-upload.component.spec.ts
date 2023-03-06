import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HREventUploadComponent } from './hr-event-upload.component';

describe('HREventUploadComponent', () => {
  let component: HREventUploadComponent;
  let fixture: ComponentFixture<HREventUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HREventUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HREventUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
