import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cRawMaterialIssueComponent } from './k4c-raw-material-issue.component';

describe('K4cRawMaterialIssueComponent', () => {
  let component: K4cRawMaterialIssueComponent;
  let fixture: ComponentFixture<K4cRawMaterialIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cRawMaterialIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cRawMaterialIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
