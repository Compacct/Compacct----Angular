import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudiologistTargetComponent } from './audiologist-target.component';

describe('AudiologistTargetComponent', () => {
  let component: AudiologistTargetComponent;
  let fixture: ComponentFixture<AudiologistTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudiologistTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudiologistTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
