import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoBdaWiseTargetComponent } from './tuto-bda-wise-target.component';

describe('TutoBdaWiseTargetComponent', () => {
  let component: TutoBdaWiseTargetComponent;
  let fixture: ComponentFixture<TutoBdaWiseTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoBdaWiseTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoBdaWiseTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
