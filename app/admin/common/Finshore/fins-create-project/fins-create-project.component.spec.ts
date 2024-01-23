import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinsCreateProjectComponent } from './fins-create-project.component';

describe('FinsCreateProjectComponent', () => {
  let component: FinsCreateProjectComponent;
  let fixture: ComponentFixture<FinsCreateProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinsCreateProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinsCreateProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
