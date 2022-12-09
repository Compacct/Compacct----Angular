import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BSHPLHfFollowUpComponent } from './bshpl-hf-follow-up.component';

describe('BSHPLHfFollowUpComponent', () => {
  let component: BSHPLHfFollowUpComponent;
  let fixture: ComponentFixture<BSHPLHfFollowUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BSHPLHfFollowUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BSHPLHfFollowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
