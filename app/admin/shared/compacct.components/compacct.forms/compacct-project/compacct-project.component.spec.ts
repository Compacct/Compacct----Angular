import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompacctProjectComponent } from './compacct-project.component';

describe('CompacctProjectComponent', () => {
  let component: CompacctProjectComponent;
  let fixture: ComponentFixture<CompacctProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompacctProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
