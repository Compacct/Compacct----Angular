import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoUploadDataSupportComponent } from './tuto-upload-data-support.component';

describe('TutoUploadDataSupportComponent', () => {
  let component: TutoUploadDataSupportComponent;
  let fixture: ComponentFixture<TutoUploadDataSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoUploadDataSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoUploadDataSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
