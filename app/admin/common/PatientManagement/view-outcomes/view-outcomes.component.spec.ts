import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOutcomesComponent } from './view-outcomes.component';

describe('ViewOutcomesComponent', () => {
  let component: ViewOutcomesComponent;
  let fixture: ComponentFixture<ViewOutcomesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewOutcomesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOutcomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
