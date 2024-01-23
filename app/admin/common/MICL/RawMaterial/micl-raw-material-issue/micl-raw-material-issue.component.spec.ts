import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiclRawMaterialIssueComponent } from './micl-raw-material-issue.component';

describe('MiclRawMaterialIssueComponent', () => {
  let component: MiclRawMaterialIssueComponent;
  let fixture: ComponentFixture<MiclRawMaterialIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiclRawMaterialIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiclRawMaterialIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
