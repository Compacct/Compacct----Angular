import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoDsDashboardComponent } from './tuto-ds-dashboard.component';

describe('TutoDsDashboardComponent', () => {
  let component: TutoDsDashboardComponent;
  let fixture: ComponentFixture<TutoDsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoDsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoDsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
