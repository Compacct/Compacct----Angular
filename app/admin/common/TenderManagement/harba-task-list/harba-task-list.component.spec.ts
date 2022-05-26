import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HarbaTaskListComponent } from './harba-task-list.component';

describe('HarbaTaskListComponent', () => {
  let component: HarbaTaskListComponent;
  let fixture: ComponentFixture<HarbaTaskListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HarbaTaskListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarbaTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
