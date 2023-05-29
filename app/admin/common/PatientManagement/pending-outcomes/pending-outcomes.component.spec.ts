import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingOutcomesComponent } from './pending-outcomes.component';

describe('PendingOutcomesComponent', () => {
  let component: PendingOutcomesComponent;
  let fixture: ComponentFixture<PendingOutcomesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingOutcomesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingOutcomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
