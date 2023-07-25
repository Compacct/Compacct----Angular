import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SofthearAudiologistTargetComponent } from './softhear-audiologist-target.component';

describe('SofthearAudiologistTargetComponent', () => {
  let component: SofthearAudiologistTargetComponent;
  let fixture: ComponentFixture<SofthearAudiologistTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SofthearAudiologistTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SofthearAudiologistTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
