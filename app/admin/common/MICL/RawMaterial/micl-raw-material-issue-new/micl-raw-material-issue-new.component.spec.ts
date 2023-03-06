import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiclRawMaterialIssueNewComponent } from './micl-raw-material-issue-new.component';

describe('MiclRawMaterialIssueNewComponent', () => {
  let component: MiclRawMaterialIssueNewComponent;
  let fixture: ComponentFixture<MiclRawMaterialIssueNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiclRawMaterialIssueNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiclRawMaterialIssueNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
