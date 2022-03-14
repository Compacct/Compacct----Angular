import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoAspUnavaliblityComponent } from './tuto-asp-unavaliblity.component';

describe('TutoAspUnavaliblityComponent', () => {
  let component: TutoAspUnavaliblityComponent;
  let fixture: ComponentFixture<TutoAspUnavaliblityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoAspUnavaliblityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoAspUnavaliblityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
