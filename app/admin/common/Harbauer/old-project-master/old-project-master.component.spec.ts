import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OldProjectMasterComponent } from './old-project-master.component';

describe('OldProjectMasterComponent', () => {
  let component: OldProjectMasterComponent;
  let fixture: ComponentFixture<OldProjectMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OldProjectMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OldProjectMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
