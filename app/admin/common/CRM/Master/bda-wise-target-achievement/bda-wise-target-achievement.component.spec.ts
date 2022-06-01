import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BdaWiseTargetAchievementComponent } from './bda-wise-target-achievement.component';

describe('BdaWiseTargetAchievementComponent', () => {
  let component: BdaWiseTargetAchievementComponent;
  let fixture: ComponentFixture<BdaWiseTargetAchievementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BdaWiseTargetAchievementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BdaWiseTargetAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
