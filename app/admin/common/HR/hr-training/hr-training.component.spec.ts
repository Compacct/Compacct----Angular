import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrTrainingComponent } from './hr-training.component';

describe('HrTrainingComponent', () => {
  let component: HrTrainingComponent;
  let fixture: ComponentFixture<HrTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
