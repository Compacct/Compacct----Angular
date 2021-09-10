import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoyaleTaskComponent } from './royale-task.component';

describe('RoyaleTaskComponent', () => {
  let component: RoyaleTaskComponent;
  let fixture: ComponentFixture<RoyaleTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoyaleTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoyaleTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
