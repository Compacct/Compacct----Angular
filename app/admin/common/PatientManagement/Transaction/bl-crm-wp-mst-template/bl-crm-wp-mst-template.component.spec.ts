import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlCRMWPMSTTemplateComponent } from './bl-crm-wp-mst-template.component';

describe('BlCRMWPMSTTemplateComponent', () => {
  let component: BlCRMWPMSTTemplateComponent;
  let fixture: ComponentFixture<BlCRMWPMSTTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlCRMWPMSTTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlCRMWPMSTTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
