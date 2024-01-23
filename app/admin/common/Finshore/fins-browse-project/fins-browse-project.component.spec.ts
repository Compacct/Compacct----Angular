import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinsBrowseProjectComponent } from './fins-browse-project.component';

describe('FinsBrowseProjectComponent', () => {
  let component: FinsBrowseProjectComponent;
  let fixture: ComponentFixture<FinsBrowseProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinsBrowseProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinsBrowseProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
