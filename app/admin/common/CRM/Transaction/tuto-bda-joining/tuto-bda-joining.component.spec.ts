import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoBdaJoiningComponent } from './tuto-bda-joining.component';

describe('TutoBdaJoiningComponent', () => {
  let component: TutoBdaJoiningComponent;
  let fixture: ComponentFixture<TutoBdaJoiningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoBdaJoiningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoBdaJoiningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
